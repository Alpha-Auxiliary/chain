const bcrypt = require('bcryptjs')

async function generatePassword() {
  const password = '123456'
  const saltRounds = 10
  
  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('密码:', password)
    console.log('哈希值:', hash)
    
    // 验证哈希是否正确
    const isValid = await bcrypt.compare(password, hash)
    console.log('验证结果:', isValid)
    
    console.log('\n请将以下SQL语句复制到数据库中执行:')
    console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`)
    
  } catch (error) {
    console.error('生成密码哈希失败:', error)
  }
}

generatePassword()