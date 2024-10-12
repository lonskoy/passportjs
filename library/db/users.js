const records = [
    {
        id: 1,
        username: "user",
        password: "123456",
        displayName: "demo user",
        emails: [{value: "user@mail.ru"}]
    },
    {
        id: 2,
        username: "user2",
        password: "123456",
        displayName: "demo user2",
        emails: [{value: "user2@mail.ru"}]
    }
]

exports.findById = function (id, cb) {
    process.nextTick(function () {
      const idx = id - 1
      if (records[idx]) {
        console.log(`Пользователь по id найден: ${records[idx]}`)
        cb(null, records[idx])
      } else {
        console.log('Пользователь по id не найден')
        cb(new Error('User ' + id + ' does not exist'))
      }
    })
  }
  
  exports.findByUsername = function (username, cb) {
    process.nextTick(function () {
      let i = 0, len = records.length
      for (; i < len; i++) {
        const record = records[i]
        if (record.username === username) {
            console.log('Пользователь найден -> findByUsernam')
          return cb(null, record)
        }
      }
      console.log('Пользователь не  найден -> findByUsernam')
      return cb(null, null)
    })
  }
  
  exports.verifyPassword = (user, password) => {
    return user.password === password
  }