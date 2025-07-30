const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8080

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'agricultural_trace',
  port: process.env.DB_PORT || 3306,
  charset: 'utf8mb4',
  timezone: '+08:00'
}

// 创建数据库连接池
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ 数据库连接成功')
    connection.release()
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
  }
}

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log('认证中间件 - Authorization头:', authHeader)
  console.log('认证中间件 - 提取的token:', token)

  if (!token) {
    return res.status(401).json({ message: '访问令牌缺失' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT验证失败:', err.message)
      return res.status(403).json({ message: '令牌无效' })
    }
    console.log('JWT验证成功，用户信息:', user)
    req.user = user
    next()
  })
}

// 基础路由测试
app.get('/api/test', (req, res) => {
  res.json({ message: '服务器运行正常', timestamp: new Date().toISOString() })
})

// 临时测试接口 - 不需要认证
app.get('/api/statistics-test', (req, res) => {
  console.log('收到统计测试请求')
  res.json({
    message: '获取成功',
    data: {
      totalProducts: 120,
      totalCodes: 856,
      totalQueries: 1234,
      activeFarmers: 45,
      queryTrend: [
        { date: '2024-01-22', count: 45 },
        { date: '2024-01-23', count: 52 },
        { date: '2024-01-24', count: 38 },
        { date: '2024-01-25', count: 61 },
        { date: '2024-01-26', count: 47 },
        { date: '2024-01-27', count: 55 },
        { date: '2024-01-28', count: 63 }
      ],
      categoryDistribution: [
        { category: '蔬菜', count: 45 },
        { category: '水果', count: 32 },
        { category: '粮食', count: 28 },
        { category: '肉类', count: 15 }
      ]
    }
  })
})

// 1. 用户认证
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )

    if (users.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    const user = users[0]
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 2. 溯源查询
app.post('/api/trace', async (req, res) => {
  try {
    const { code } = req.body

    const [traces] = await pool.execute(`
      SELECT t.*, p.name as product_name, p.category, p.description,
             c.name as company_name, c.address as company_address
      FROM trace_records t
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN companies c ON t.company_id = c.id
      WHERE t.trace_code = ?
      ORDER BY t.created_at ASC
    `, [code])

    if (traces.length === 0) {
      return res.status(404).json({ message: '未找到该溯源码的记录' })
    }

    // 获取溯源步骤
    const [steps] = await pool.execute(`
      SELECT ts.*, s.name as step_name, s.description as step_description
      FROM trace_steps ts
      LEFT JOIN steps s ON ts.step_id = s.id
      WHERE ts.trace_code = ?
      ORDER BY ts.step_order ASC
    `, [code])

    res.json({
      message: '查询成功',
      data: {
        basic_info: traces[0],
        steps: steps
      }
    })
  } catch (error) {
    console.error('溯源查询错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 3. 产品管理
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query
    const offset = (page - 1) * limit

    let whereClause = '1=1'
    let params = []

    if (category) {
      whereClause += ' AND category = ?'
      params.push(category)
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    const [products] = await pool.execute(`
      SELECT * FROM products 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)])

    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total FROM products WHERE ${whereClause}
    `, params)

    res.json({
      message: '获取成功',
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    })
  } catch (error) {
    console.error('获取产品列表错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 4. 统计数据
app.get('/api/statistics', authenticateToken, async (req, res) => {
  try {
    // 获取基础统计
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products')
    const [traceCount] = await pool.execute('SELECT COUNT(*) as count FROM trace_records')
    
    // 模拟数据
    const queryCount = [{ count: 156 }]
    const farmerCount = [{ count: 23 }]

    // 模拟趋势数据
    const queryTrend = [
      { date: '2024-01-22', count: 45 },
      { date: '2024-01-23', count: 52 },
      { date: '2024-01-24', count: 38 },
      { date: '2024-01-25', count: 61 },
      { date: '2024-01-26', count: 47 },
      { date: '2024-01-27', count: 55 },
      { date: '2024-01-28', count: 63 }
    ]

    // 模拟分类分布
    const categoryDist = [
      { category: '蔬菜', count: 45 },
      { category: '水果', count: 32 },
      { category: '粮食', count: 28 },
      { category: '肉类', count: 15 }
    ]

    res.json({
      message: '获取成功',
      data: {
        totalProducts: productCount[0].count,
        totalCodes: traceCount[0].count,
        totalQueries: queryCount[0].count,
        activeFarmers: farmerCount[0].count,
        queryTrend: queryTrend,
        categoryDistribution: categoryDist
      }
    })
  } catch (error) {
    console.error('获取统计数据错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 5. 分类管理
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const [categories] = await pool.execute(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.name = p.category
      GROUP BY c.id
      ORDER BY c.sort_order ASC
    `)

    res.json({
      message: '获取成功',
      data: categories
    })
  } catch (error) {
    console.error('获取分类列表错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 用户注册接口 - 修复undefined问题
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('收到注册请求:', req.body)

    const { username, password, name, email, phone, role } = req.body

    // 验证必填字段
    if (!username || !password) {
      console.log('验证失败: 缺少必填字段')
      return res.status(400).json({ message: '用户名和密码不能为空' })
    }

    // 检查用户名是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    )

    if (existingUsers.length > 0) {
      console.log('用户名已存在:', username)
      return res.status(409).json({ message: '用户名已存在' })
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('密码加密完成')

    // 处理所有字段，确保没有undefined
    const nameValue = name || username // 如果没有name就用username
    const emailValue = email || null
    const phoneValue = phone || null
    const roleValue = role || 'user'

    console.log('准备插入的数据:', {
      username,
      name: nameValue,
      email: emailValue,
      phone: phoneValue,
      role: roleValue
    })

    // 插入新用户
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, nameValue, emailValue, phoneValue, roleValue]
    )

    console.log('用户创建成功, ID:', result.insertId)

    res.status(201).json({
      message: '用户注册成功',
      user: {
        id: result.insertId,
        username,
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        role: roleValue
      }
    })

  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '服务器错误: ' + error.message })
  }
})

// 更新用户信息接口
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, role, status } = req.body

    // 检查权限（只有管理员可以修改其他用户信息）
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: '权限不足' })
    }

    const [result] = await pool.execute(
      'UPDATE users SET name = ?, email = ?, phone = ?, role = ?, status = ? WHERE id = ?',
      [name, email, phone, role, status, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '用户不存在' })
    }

    res.json({ message: '用户信息更新成功' })

  } catch (error) {
    console.error('更新用户错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 修改密码接口
app.put('/api/users/:id/password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { oldPassword, newPassword } = req.body

    // 检查权限
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: '权限不足' })
    }

    // 如果不是管理员，需要验证旧密码
    if (req.user.role !== 'admin') {
      const [users] = await pool.execute('SELECT password FROM users WHERE id = ?', [id])
      if (users.length === 0) {
        return res.status(404).json({ message: '用户不存在' })
      }

      const isValidOldPassword = await bcrypt.compare(oldPassword, users[0].password)
      if (!isValidOldPassword) {
        return res.status(400).json({ message: '原密码错误' })
      }
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // 更新密码
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '用户不存在' })
    }

    res.json({ message: '密码修改成功' })

  } catch (error) {
    console.error('修改密码错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 6. 用户管理
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, status } = req.query
    const offset = (page - 1) * limit

    let whereClause = '1=1'
    let params = []

    if (role) {
      whereClause += ' AND role = ?'
      params.push(role)
    }

    if (status) {
      whereClause += ' AND status = ?'
      params.push(status)
    }

    if (search) {
      whereClause += ' AND (username LIKE ? OR name LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    const [users] = await pool.execute(`
      SELECT id, username, name, email, phone, role, status, created_at, updated_at
      FROM users 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)])

    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total FROM users WHERE ${whereClause}
    `, params)

    res.json({
      message: '获取成功',
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    })

  } catch (error) {
    console.error('获取用户列表错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 7. 溯源记录管理
app.get('/api/trace/records', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query
    const offset = (page - 1) * limit

    let whereClause = '1=1'
    let params = []

    if (search) {
      whereClause += ' AND (t.trace_code LIKE ? OR p.name LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    const [records] = await pool.execute(`
      SELECT t.*, p.name as product_name, p.category,
             c.name as company_name
      FROM trace_records t
      LEFT JOIN products p ON t.product_id = p.id
      LEFT JOIN companies c ON t.company_id = c.id
      WHERE ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)])

    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total FROM trace_records t
      LEFT JOIN products p ON t.product_id = p.id
      WHERE ${whereClause}
    `, params)

    res.json({
      message: '获取成功',
      data: records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    })

  } catch (error) {
    console.error('获取溯源记录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 8. 创建溯源记录
app.post('/api/trace/records', authenticateToken, async (req, res) => {
  try {
    const {
      trace_code,
      product_id,
      company_id,
      batch_number,
      production_date,
      quantity,
      unit,
      location,
      operator,
      notes
    } = req.body

    const [result] = await pool.execute(`
      INSERT INTO trace_records 
      (trace_code, product_id, company_id, batch_number, production_date, quantity, unit, location, operator, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [trace_code, product_id, company_id, batch_number, production_date, quantity, unit, location, operator, notes])

    res.status(201).json({
      message: '溯源记录创建成功',
      data: { id: result.insertId, trace_code }
    })

  } catch (error) {
    console.error('创建溯源记录错误:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: '溯源码已存在' })
    } else {
      res.status(500).json({ message: '服务器错误' })
    }
  }
})

// 启动服务器
app.listen(PORT, async () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📊 测试接口: http://localhost:${PORT}/api/test`)
  console.log(`📈 统计测试: http://localhost:${PORT}/api/statistics-test`)
  await testConnection()
})

module.exports = app







