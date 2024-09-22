// LiteLoader-AIDS automatic generated
/// <reference path="c:\WorldLib\McLL/dts/HelperLib-master/src/index.d.ts"/> 

ll.registerPlugin(
    /* name */ "",
    /* introduction */ "",
    /* version */[0, 0, 1],
    /* otherInformation */ null
);

const conf = new JsonConfigFile("./plugins/MLses/config.json")

class NoSql extends KVDatabase {
    constructor(path, data) {
        super("./plugins/MLses/Datas/" + path)
        this.hasInit = this.get("init") == null ? false : true

        if (this.hasInit) {
            this.set("Init", true)
            this.init(data)
        }

        this.normalLoading(data)

    }

    async get(name) {
        this.data = await super.get(name);
        this.data.upTime = new Date()
        return name
    }

    async set(name, value) {
        this.value = new ReturnData(value, new Date(), null)
        super.set(name, value)
    }

    normalLoading() {

    }

    async upData(name, value) {
        let va = await this.get(name)
        this.set(name, value)
    }

    init() {

    }
}

class PlayerData extends NoSql {
    constructor(path){
        super("PlayerData/" + path.pl)
    }

    normalLoading(pl){
        this.pl = pl
    }

    async init(pl){
        this.conf = await new JsonConfigFile("./plugins/MLses/Datas/PlayerData/" + pl.xuid)
        this.conf.set("name", pl.name)
        this.conf.set("ip", pl.ip)
        this.conf.set("uniqueId", pl.uniqueId)
        this.conf.set("langCode", pl.langCode)
    }

    setInfo(name, value){
        this.conf.set(name, value)
        this.conf.init()
    }

    async getInfo(name, func){
        await this.conf.get(name)
        func(this.conf)
    }

    eventData(event){
        mc.listen(event, (data)=>{
            this.set(name, data)
        } )
    }

    Die(){
        File.delete("./plugins/MLses/Datas/PlayerData/" + pl.xuid)
    }


}

class EntityData extends NoSql {
    constructor(path){
        super("EntityData/" + path.pl)
    }

    init(){

    }

    eventData(){
        mc.listen(event, (data)=>{
            this.set(name, data)
        } )
    }

    Die(){
        File.delete("./plugins/MLses/Datas/EntityData/" + pl.xuid)
    }
}

class ReturnData {
    constructor(value, upTime, setTime) {
        this.value = value;
        this.upTime = upTime
        this.setTime = setTime
    }
}

let api = {
    onPlayerGet: [],
    onPlayerSet: [],
    onGet: [],
    onDataGet: [],
    onDataSet: [],
    onPost: [],
    onEntityGet: [],
    onEntitySet: [],
    on(event, func) {
        this[event].push(func)
        log(`The Event ${event} has Add Func `)
    }
}

const server = new HttpServer()
server.onException(function (req, res) {
    logger.error(req.toString())
    logger.error(res.toString())
    throw new Error("The Storage API Has Error")
})


function startEvents(stings, req, res) {
    function run(event, req, res) {
        api[event].forEach(e => {
            e(req, res)
        })
    }

    if (path.length >= 7) {
        if (path.substring(0, 6) == "Player") {
            run(stings[0], req, res)
        } else if (path.substring(0, 6) == "Entity") {
            run(stings[1], req, res)
        } else if (path.substring(0, 4) == "Data") {
            run(stings[2], req, res)
        } else {
            run(stings[3], req, res)
        }
    }
}

mc.listen("onPreJoin", async function(pl){
    let data = await new PlayerData(pl)
    pl.setExtraData("PlayerData", data)
})

server.onGet(path, function (req, res) {
    startEvents(["onPlayerGet", "onEntityGet", "onDataGet", "onGet"], req, res)

})

server.onPost(path, function (req, res) {
    startEvents(["onPlayerSet", "onEntitySet", "onDataSet", "onSet"], req, res)
})

server.listen(conf.get("port"))

ll.exports(NoSql, "Mlses", "NoSql")
ll.exports(PlayerData, "Mlses", "PlayerData")
ll.exports(EntityData, "Mlses", "EntityData")
ll.exports(ReturnData, "Mlses", "ReturnData")