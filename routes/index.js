import { Router } from "express";

const router = new Router();

router.route("/").get((_req, res) => res.send({ msg: "404" }));

router.route("/api").get((_req, res) => res.json({ msg: "pong" }));

export default router;
