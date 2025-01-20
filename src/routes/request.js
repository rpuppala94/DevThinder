const express = require("express");
const { ObjectId } = require("mongodb");

const ConnectionRequest = require("../models/connectRequest");
const { adminAuth } = require("../middleware/adminAuth");

const connectRequest = express.Router();

connectRequest.post(
  "/connectRequest/send/:statusId/:userId",
  adminAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const toUserId = user._id;
      const fromUserId = req.params.userId;

      const connectRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status: req.params.statusId,
      });

      const validConnectRequest = await ConnectionRequest.find({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (validConnectRequest.length !== 0) {
        throw new Error(", already Request has sent to this request ");
      }

      const requestDetails = await connectRequest.save();

      res.json({
        message: "Successfully saved",
        requestDetails,
      });
    } catch (error) {
      res.status(400).send("Please try again later " + error.message);
    }
  }
);

connectRequest.post(
  "/connectRequest/review/:statusId/:userId",
  adminAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const { userId, statusId } = req.params;

      const allowedReq = ["rejected", "accepted"];

      if (!allowedReq.includes(statusId)) {
        res.status(404).send({
          message: "Request status not found",
        });
      }

      const connectRequest = await new ConnectionRequest.findOne({
        id: userId,
        toUserId: loggedUser._id,
        status: "intersted",
      });

      if (!connectRequest) {
        res.status(404).send({
          message: "Connection Request not found",
        });
      }

      connectRequest.status = statusId;
      const data = await connectRequest.save();
      res.status(200).send({
        message: "Connection Request" + statusId,
        data,
      });
    } catch (error) {
      res.status(400).send("there is something wrong");
    }
  }
);

module.exports = connectRequest;
