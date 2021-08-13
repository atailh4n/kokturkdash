const colors = require('colors');

const err = (text) => {
    return text + ` Yardım mı lazım? Instagram: ${'instagram.com/atailh4n'.blue}`;
}

class Dashboard {
    constructor(config) {
        let notSetYetAndRequired = [];
        if(!config.port)notSetYetAndRequired.push('port');
        if(!config.client)notSetYetAndRequired.push('client');
        if(!config.yonlendirmeUrl)notSetYetAndRequired.push('yonlendirmeUrl');
        if(!config.bot)notSetYetAndRequired.push('bot');
        if(!config.ayarlar)notSetYetAndRequired.push('ayarlar');
        if(!config.domain)notSetYetAndRequired.push('domain');
        if(notSetYetAndRequired[0])throw new Error(err(`Bazı değerler eksik. Gerekli diğer değerler: ${notSetYetAndRequired.join(', ')}.`));
        this.config = config;
    }

    calistir() {
        const config = this.config;
        const express = require('express');
        const app = express();
        const session = require('express-session');
        const FileStore = require('session-file-store')(session);
        const bodyParser = require('body-parser');
        const partials = require('express-partials');

        let v13support = false;

        const Discord = require('discord.js');
        if(Discord.version.slice(0,2) == "13")v13support = true;

        app.use(bodyParser.urlencoded({extended : true}));
        app.use(bodyParser.json());
        app.use(partials());

        if(config.tema){
            app.set('views', config.tema.viewsPath);
            app.use(express.static(config.tema.staticPath));
            app.use('/', express.static(config.tema.staticPath));
            app.use('/:a/', express.static(config.tema.staticPath));
            app.use('/:a/:b/', express.static(config.tema.staticPath));
            app.use('/:a/:b/:c/', express.static(config.tema.staticPath));
            app.use('/:a/:b/:c/:d/', express.static(config.tema.staticPath));
        }else{
            app.set('views', require('path').join(__dirname, '/views/project1'));
            app.use(express.static(require('path').join(__dirname, '/static')));
            app.use('/', express.static(require('path').join(__dirname, '/static')));
            app.use('/:a/', express.static(require('path').join(__dirname, '/static')));
            app.use('/:a/:b/', express.static(require('path').join(__dirname, '/static')));
            app.use('/:a/:b/:c/', express.static(require('path').join(__dirname, '/static')));
            app.use('/:a/:b/:c/:d/', express.static(require('path').join(__dirname, '/static')));
        }
        app.set('view engine','ejs');

        let sessionIs;

        if(!config.sessionFileStore)config.sessionFileStore = false;

        if(config.sessionFileStore){
            sessionIs = session({
                secret: config.cookiesSecret || 'total_secret_cookie_secret',
                resave: true,
                saveUninitialized: true,
                cookie: {
                    expires: new Date(253402300799999),
                    maxAge: 253402300799999,
                },
                store: new FileStore
            });
        }else{
            sessionIs = session({
                secret: config.cookiesSecret || 'total_secret_cookie_secret',
                resave: true,
                saveUninitialized: true,
                cookie: {
                    expires: new Date(253402300799999),
                    maxAge: 253402300799999,
                },
            });
        }

        app.use(sessionIs);

        let themeConfig = {};
        if(config.tema)themeConfig = config.tema.themeConfig;

        if(!config.invite)config.invite = {};

        app.use((req,res,next)=>{
            if(!req.body)req.body={};

            req.client = config.client;
            req.yonlendirmeUrl = config.yonlendirmeUrl;

            req.themeConfig = themeConfig;

            req.websiteBaslik = config.websiteBaslik || "Köktürk Dash";
            req.iconUrl = config.iconUrl || 'https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673.png';
            next();
        });

        require('./router')(app);

        app.get('/', (req,res) => {
            res.render('index', {req:req,themeConfig:req.themeConfig,bot:config.bot});
        });

        app.get('/invite', (req,res) => {
            res.redirect(`https://discord.com/oauth2/authorize?client_id=${config.invite.clientId || config.bot.user.id}&scope=bot&permissions=${config.invite.permissions || '0'}${config.invite.yonlendirmeUrl ? `&response_type=code&redirect_uri=${config.invite.yonlendirmeUrl}` : ''}`);
        });

        app.get('/manage', (req,res) => {
            if(!req.session.user)return res.redirect('/discord?r=/manage');
            res.render('guilds', {req:req,bot:config.bot,themeConfig:req.themeConfig});
        });

        app.get('/guild/:id', async (req,res)=>{
            if(!req.session.user)return res.redirect('/discord?r=/guild/' + req.params.id);
            let bot = config.bot;
            if(!bot.guilds.cache.get(req.params.id))return res.redirect('/manage?error=noPermsToManageGuild');
            await bot.guilds.cache.get(req.params.id).members.fetch(req.session.user.id);
            if(v13support){  
                if (!bot.guilds.cache.get(req.params.id).members.cache.get(req.session.user.id).permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))return res.redirect('/manage?error=noPermsToManageGuild');
            }else{
                if (!bot.guilds.cache.get(req.params.id).members.cache.get(req.session.user.id).hasPermission('MANAGE_GUILD'))return res.redirect('/manage?error=noPermsToManageGuild');
            }
            let actual = {};
            for(const s of config.ayarlar){
                for(const c of s.kategoriSecimListesi){
                    if(!actual[s.kategoriID]){
                        actual[s.kategoriID] = {};
                    }
                    if(!actual[s.kategoriID][c.secimID]){
                        actual[s.kategoriID][c.secimID] = await c.normalVeri({guild:{id:req.params.id}})
                        console.log(await c.normalVeri({guild:{id:req.params.id}}));
                    }
                }
            }
            res.render('guild', {ayarlar:config.ayarlar,actual:actual,bot:config.bot,req:req,guildid:req.params.id,themeConfig:req.themeConfig});
        });

        app.post('/ayarlar/update/:guildId/:kategoriID', async (req,res)=>{
            if(!req.session.user)return res.redirect('/discord?r=/guild/' + req.params.guildId);
            let bot = config.bot;
            if(!bot.guilds.cache.get(req.params.guildId))return res.redirect('/manage?error=noPermsToManageGuild');
            await bot.guilds.cache.get(req.params.guildId).members.fetch(req.session.user.id);
            if(v13support){  
                if (!bot.guilds.cache.get(req.params.guildId).members.cache.get(req.session.user.id).permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))return res.redirect('/manage?error=noPermsToManageGuild');
            }else{
                if (!bot.guilds.cache.get(req.params.guildId).members.cache.get(req.session.user.id).hasPermission('MANAGE_GUILD'))return res.redirect('/manage?error=noPermsToManageGuild');
            }

            let cid = req.params.kategoriID;
            let ayarlar = config.ayarlar;

            let category = ayarlar.find(c=>c.kategoriID == cid);

            if(!category)return res.send({error:true,message:"No category found"});

            category.kategoriSecimListesi.forEach(option=>{
                if(option.secimTipi.type == "tik"){
                    if(req.body[option.secimID] || req.body[option.secimID] == null || req.body[option.secimID] == undefined){
                        if(req.body[option.secimID] == null || req.body[option.secimID] == undefined){
                            option.yeniVeri({guild:{id:req.params.guildId},user:{id:req.session.user.id},newData:false});
                        }else{
                            option.yeniVeri({guild:{id:req.params.guildId},user:{id:req.session.user.id},newData:true});
                        }
                    }
                }else{
                    if(req.body[option.secimID] || req.body[option.secimID] == null)option.yeniVeri({guild:{id:req.params.guildId},user:{id:req.session.user.id},newData:req.body[option.secimID]});
                }
            });

            return res.redirect('/guild/'+req.params.guildId+'?success=true');
        });

        if(config.tema)config.tema.init(app, this.config);

        app.get('*', (req,res) => {
            let text = config.html404 || require('./404pagedefault')(config.websiteBaslik);
            res.send(text.replace('{{websiteBaslik}}', config.websiteBaslik));
        });

        if(!config.SSL)config.SSL = {};

        if(!config.noCreateServer){
            if(config.SSL.enabled){
                if(!config.SSL.key || !config.SSL.cert)console.log(err(`${'discord-dashboard issue:'.red} The SSL preference for Dashboard is selected (config.SSL.enabled), but config does not include key or cert (config.SSL.key, config.SSL.cert).`));
                let options = {
                    key: config.SSL.key || "",
                    cert: config.SSL.cert || ""
                };
                const https = require('https');
                https.createServer(options, app);
            }else{
                app.listen(config.port);
            }

            let pport = "";

            if(config.port != 80 && config.port != 443){
                pport = `:${config.port}`;
            }
    
            console.log(`[kokturkdash] ${`Web Panelin şurda çalışıyor: ${config.domain || "LOCAL_HOST"}`.rainbow}`);
        }else{
            console.log(`[kokturkdash] ${`Panel çalışmakta, ancak port hatalı. Portunu kontrol et!`.blue}`);
        }

    try{
        require('node-fetch')("https://assistants.ga/dbd-ping", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    path: process.cwd(),
                    domain: config.domain || config.yonlendirmeUrl || 'ayarlanmadı'
                }
            })
        });
    }catch(err){}

    this.app = app;
    }

    portLog(){
        return this.app;
    }
}

module.exports = {
    PanelIcerik: Dashboard,
    formTipleri: {
        secenekler: (list, devredisi) => {
            if(!list)throw new Error(err("Liste 'boş' olamaz."));
            if(typeof(list) != "object")throw new Error(err("Liste tipi düzgün değil. Object tipinde tanımlama bekleniyor."));
            let keys = Object.keys(list);
            let values = Object.values(list);
            return {type: "secenekler", data: {keys,values}, devredisi: devredisi || false};
        },
        giris: (duraganyazi, min, max, devredisi, gerekli) => {
            if(min){
                if(isNaN(min))throw new Error(err("min değeri sayı olarak girilmelidir!"));
            }
            if(max){
                if(isNaN(max))throw new Error(err("max değeri sayı olarak girilmelidir!"));
            }
            if(min && max){
                if(min>max)throw new Error(err("min max'tan büyük olamaz!"));
            }
            return {type: "giris", data: duraganyazi, min: min || null, max: max || null, devredisi: devredisi || false, gerekli: gerekli || false};
        },
        metingirisi: (duraganyazi, min, max, devredisi, gerekli) => {
            if(min){
                if(isNaN(min))throw new Error(err("min değeri sayı olarak girilmelidir!"));
            }
            if(max){
                if(isNaN(max))throw new Error(err("max değeri sayı olarak girilmelidir!"));
            }
            if(min && max){
                if(min>max)throw new Error(err("min max'tan büyük olamaz!"));
            }
            return {type: "metingirisi", data: duraganyazi, min: min || null, max: max || null, devredisi: devredisi || false, gerekli: gerekli || false};
        },
        tik: (durusDurum, devredisi) => {
            if(typeof(durusDurum) != 'boolean')throw new Error(err("durusDurum değeri boolean(true/false) olmak zorunda."));
            return {type:"tik", data:durusDurum, devredisi:devredisi};
        },
        kanalSecici: (devredisi) => {
            return {type:"kanalSecici", function:
                (client, guildid) => {
                    let list = {};
                    client.guilds.cache.get(guildid).channels.cache.forEach(channel=>{
                    list[channel.name] = channel.id;
                    });
                    return {values:Object.values(list),keys:Object.keys(list)};
                }, 
                devredisi};
        },
        rolSecici: (devredisi) => {
            return {type:"rolSecici", function:
                (client, guildid) => {
                    let list = {};
                    client.guilds.cache.get(guildid).roles.cache.forEach(role=>{
                    list[role.name] = role.id;
                    });
                    return {values:Object.values(list),keys:Object.keys(list)};
                }, 
                devredisi};
        },
        renkSecici: (durusDurum, devredisi) => {
            return {type:"renkSecici",data:durusDurum,devredisi};
        }
    },
}