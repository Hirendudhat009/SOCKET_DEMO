import io from './src/chat/chat.connection'
import routes from "./routes"
import express from "express";
import path from "path"
import cors from "cors"
import http from 'http'
// models
import modelsAllRelations from "./models";
import { PORT } from "./src/common/constants/config-constant"

const app = express()

//template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(`${__dirname}/public`))



const corsOptions = { origin: process.env.ALLOW_ORIGIN };
app.use(cors(corsOptions));

app.use(routes)

const server = http.Server(app)
io.attach(server)


modelsAllRelations.sequelize.sync({ alter: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Your application is running on ${PORT}`);
        })
    })
