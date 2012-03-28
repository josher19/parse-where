 p=require('../../parse-where/')
 p.sql.select('score,createdAt,updatedAt').from('GameScore')(console.log)
