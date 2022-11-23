import express from "express"
import { baseUrl } from "../src/common/constants/config-constant"
const router = express.Router();

router.get('/', function (req, res) {
  res.render(`chat`)
})

router.get('/changelogs', function (req, res) {
  res.render(`changelogs`, { baseUrl: baseUrl() })
})




module.exports = router
