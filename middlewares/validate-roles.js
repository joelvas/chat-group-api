const { response } = require('express')

const isAdminRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      msg: 'JWT verification required.'
    })
  }
  const { role, name } = req.user
  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `Admin role required. ${name} is not an admin.`
    })
  }
  next();
}

const isAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      msg: 'JWT verification required.'
    })
  }
  const { role, name } = req.user
  if (req.user.id !== req.params.id && role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `Admin role required or must be the owner. ${name} is not an admin or the owner.`
    })
  }
  next();
}

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(401).json({
        msg: 'JWT verification required.'
      })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `Your role must be: ${roles}`
      })
    }
    next();
  }
}

const isOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      msg: 'JWT verification required.'
    })
  }
  if (req.user.id !== req.params.id) {
    return res.status(401).json({
      msg: 'Only the owner can delete this row.'
    })
  }
  next();
}

module.exports = { isAdminRole, hasRole, isOwner, isAdminOrOwner }