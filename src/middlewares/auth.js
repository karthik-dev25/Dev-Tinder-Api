const adminAuth = (req, res, next) => {
    console.log("Admin Auth executed")
  let token = "xyz";
  let isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized requests");
  }
  next();
};

module.exports = {
    adminAuth
}
