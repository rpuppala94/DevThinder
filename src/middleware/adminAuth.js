const adminAuth = (error, req, res, next) => {
  try {
    const isAuth = "req.params.userName";

    console.log(req.body.json());

    //   res.send(bodyParser);

    if (!isAuth) {
      res
        .status(500)
        .send("Authroization failed due to user credentials wrong!");
    }
  } catch (error) {
    res.status(500).send("Something wrong ");
  }

  next();
};

module.exports = {
  adminAuth,
};
