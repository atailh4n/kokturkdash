# ![q](https://i.hizliresim.com/7cyf88f.png)kokturkdash
![header](https://i.hizliresim.com/p4u1tvj.png)
![GitHub package.json version](https://img.shields.io/github/package-json/v/atailh4n/kokturkdash?color=ff0002&label=VERS%C4%B0YON&style=for-the-badge) ![npm bundle size (version)](https://img.shields.io/bundlephobia/min/kokturkdash/0.0.3-public?color=ff0000&label=BOYUT&style=for-the-badge) ![npm](https://img.shields.io/npm/dm/kokturkdash?color=ff0002&label=AYLIK%20%C4%B0ND%C4%B0RME&style=for-the-badge)
**Discord botlarınız için basit, güvenli ve anlaşılır dashboard modülüdür.**

## 😎0.0.5-beta Sürümü Güncellemesi:
* Methodlar, classlar, callbackler ve bazı kurallar değişti.
* Dökümanlar eklendi
* formTypes geçerliliğini yitirdi. formTipleri kullanın.
* Dashboard classı geçerliliğini yitirdi. PanelIcerik kullanın.
* Tema Eklendi([kokturkdash-cyber](https://npmjs.com/package/kokturkdash-cyber))
* Tema Kullanımı için: [Temalar](#Temalar)
**EĞER BOTUNUZ 2 DİLLİ İSE TEMADA** ```ikidil: true``` **SEÇENEĞİNİ AÇMAYI UNUTMAYIN!**

# 🤔Nasıl İndirilir
```js
npm i kokturkdash
```
# 📑Tam Örnek
```js
const kokturkdash = require('kokturkdash')
const Discord = require('discord.js');
const client = new Discord.Client();
client.login('Client Token');

let dil = {};

let hosgeldinmesaji = {};

let booster = {};

let logsys = {};

let sysactive = {};

const WebPanel = new kokturkdash.PanelIcerik({

    port: 80, // Glitch için 3000 önerilir.
    client: {
        id: 'Client ID',
        secret: 'Client Secret'
    },
    yonlendirmeUrl: 'http://domain.com/discord/callback',
    domain: 'http://domain.com',
    bot: client,
    websiteBaslik: "Köktürk Dash",
    iconURL: 'http://cdn.kokturkbot.ga/logos/kokturklogo.jpg',
    ayarlar: [
        {
            kategoriID: 'setup',//Kategori ID benzersiz(unique) olmalıdır!
            kategoriIsim: "Kurulum",// Kategori İsmi
            kategoriSecimListesi: [//Kategorinin içindeki elementler buraya yazılcak!
                {//Element Başlangıç
                    secimID: 'lang', //ID kısmı benzersiz(unique) olmalıdır!
                    secimIsim: "Dil", //Başlık Kısmı
                    secimAciklama: "Botun dilini seçin.", //Açıklama kısmı
                    secimTipi: kokturkdash.formTypes.secenekler({"Türkçe": "tr", "İngilizce": "en"}, false),//Seçim obje tipi
                    //Var olan veriyi kontrol ediyoruz ve yazdırıyoruz
                    normalVeri: async ({guild}) => {//async kullanmaya özen gösterin! Veritabanları için gereklidir. (Normal veri başlangıcı)
                        return dil[guild.id] || null;//Veriyi veritabanından çekince ya veri görüntülenecek yada boş dönecek
                    },//Normal veri bitişi
                    //Yeni veriyi ayarlıyoruz
                    yeniVeri: async ({guild,newData}) => {//Yeni veri başlangıcı
                        dil[guild.id] = newData;//Veriyi veritabanına kaydet
                        //Quick.db için örnek: await db.set(`dil.${guild.id}`, newData)
                        //Mongoose için örnek: await ModelName.findOneAndUpdate({ key: guild.id }, {$set: { key2: newData}}, {new: true});
                        return;
                    }//Yeni veri bitişi
                },//Element Bitiş
                {
                    secimID: 'log_ch',
                    secimIsim: "Log Kanalı",
                    secimAciklama: "Logların nereye atılacağını seçin.",
                    secimTipi: kokturkdash.formTypes.kanalSecici(false),
                    normalVeri: async ({guild}) => {
                        return logsys[guild.id] || null;
                    },
                    yeniVeri: async ({guild,newData}) => {
                        console.log();[guild.id] = newData;
                        return;
                    }
                },
                {
                    secimID: 'sys_aktif',
                    secimIsim: "Loglama Aç/Kapat",
                    secimAciklama: "Loglama açıp kapamaya yarar.",
                    secimTipi: kokturkdash.formTypes.tik(false, false),
                    normalVeri: async ({guild}) => {
                        return sysactive[guild.id] || null;
                    },
                    yeniVeri: async ({guild,newData}) => {
                        sysactive[guild.id] = newData;
                        return;
                    }
                },
            ]
        },
        {
            kategoriID: 'other',
            kategoriIsim: "Diğer",
            kategoriSecimListesi: [
                {
                    secimID: 'booster_rol',
                    secimIsim: "Booster Rolü",
                    secimAciklama: "Booster Rolünü seçin.",
                    secimTipi: kokturkdash.formTypes.rolSecici(false),
                    normalVeri: async ({guild}) => {
                        return booster[guild.id] || null;
                    },
                    yeniVeri: async ({guild,newData}) => {
                        booster[guild.id] = newData;
                        return;
                    }
                },
                {
                    secimID: 'hosgeldin_msj',
                    secimIsim: "Hoşgeldin Mesajı",
                    secimAciklama: "Hoşgeldin mesajı girin.",
                    secimTipi: kokturkdash.formTypes.metingirisi("Lütfen metin girin...", 7, 30, false, false),
                    normalVeri: async ({guild}) => {
                        return hosgeldinmesaji[guild.id] || null;
                    },
                    yeniVeri: async ({guild,newData}) => {
                        hosgeldinmesaji[guild.id] = newData;
                        return;
                    }
                },
            ]
        },
    ]
})

WebPanel.calistir();
```
# ⏮En Baştan

## ⬇️Modülü İndirme
Modülü ilk olarak şu şekilde indirmelisin:
```js
npm i kokturkdash
```

## 💾 Kurulum ve Tanımlama
**İlk önce modülü tanımlaman ve [panel içeriğini](#Panel-içeriği-nedir?) doldurman gerek. Aşağıda örnek bulunmakta:**
![htu](https://i.hizliresim.com/88nwcex.png)
Bu kadar. Diğer işlemleri de yaptıktan sonra hazır olacaktır.
## 🤔Panel içeriği nedir?
Panel içeriği sayesinde tüm işlemleri tek tek kodlamak yerine belli veriler ile kodlarsın. Bu veriler sitenin içeriği, ayarları yani herşeyi içerir

## 🎬Sunucuyu Başlat
Herşeyi ayarladıktan sonra, herşeyi başlatmak için bunu kullan:
```js
WebPanel.calistir();
```
Panelinii görmek için ilk önce [Kurulum](#en-bastan) yap.

# ⚙️Sunucu Ayarları
Panel içeriğiniz sunucu ayarları yapmaya müsaittir. Aşağıda örnekleri mevcuttur:
![cfg1](https://i.hizliresim.com/kii9zv6.png)

## Port
Portu bulamadın mı? Express'ten almak için:
![portlog](https://i.hizliresim.com/a51069i.png)

# ⚙️Discord Ayarları
Kokturkdash web panel modülünün birkaç gereksinime ihtiyacı var.
## 📎Gereksinimler: 
* **Redirect URI**
* **Client ID**
* **Client Secret**
* **Discord.js v12 Client**
olarak sıralanır. [Discord](#discord) kısmında bunları daha detaylı olarak anlattık.

# 🌈Temalar

Cyber Tema Modülü:
![cyber](https://i.hizliresim.com/l8njug6.png)

# ⚙️Ayarlar

## 🔢Kategori Methodları
Her kategori ayrıdır. Kategoriler bir arada düzende tutar. Çünkü her ayarın karışmasını istemeyiz, değil mi? Bunun için kategori sistemini aşağıdaki gibi yaptık:
![kategori](https://i.hizliresim.com/t1tzbtn.jpg)
Güzel gözüküyor değil mi?

**Kategori giriş ve değerleri şu şekildedir:**
* **kategoriID**: Bu kategorinin ID'sidir. Buraya sadece alfanumerik şeyler girmelisin. Ayrıca sayfa URI'sinde ID gözükecek.
* **kategoriIsim**: Kategorinin gözükecek ismi. Kısaca tıkladığınız kategori isimleri.
* **kategoriAciklama**: Aslında bu bir yerde gözükmez. Sadece kategorinin açıklamasıdır.
* **kategoriSecimListesi**: Asıl iş burda. Burda seçimleri dolduracaksınız. Kategorinin içidir. [Dökümanın diğer sayfasında](#Seçim-Methodları) bunun hakkında konuştuk.

## 🔢Seçim Methodları

Her türlü seçenekler burdan yönetilir. Gerek seçim listesi, gerekse yazı alanları yani kısaca hepsi burdan yönetilir. Aşağıda değerler bulunmakta:

* **secimID**: Seçim ID, seçeneklerin ID'sidir. Türkçe karakter içermeden alfenumerik benzersiz bir ID girmeye özen gösterin.
* **secimIsim**: Seçim ismidir. Seçeneklerin başlığı diyebiliriz.
* **secimAciklama**: Seçim başlığının altında yer alan açıklama kısmı.
* **secimTipi**: Bu çok önemlidir. Çünkü bu obje hangi verinin döneceğini söyler. Seçenekler şunlar olabilir: metingirisi, secim, tik, kanalSecici v.b. Anlamadın mı? [Aşağıda devamı bulunmakta](#Seçim-Tipleri).
* **normalVeri**: Veritabanındaki şuanki veriyi çeker ve websitenize yansıtır. Mutlaka geri dönen veri tipi, seçim tipine uymalıdır.
* **yeniVeri**: secimTipi'nden aldığınız veriyi veritabanına ekler. Callback fonksiyonları şunlardır: `{guild,user,newData}`, sunucu ve kullanıcının verileri şunlardır: `{data: guild/newData}`. `guild.id`, verileri değişen sunucunun ID'sini verir. `newData` ise az önce değiştirilen verinin kaydedilecek dönen verisidir.

## 🔢Ayarlanabilecek Seçim Tipleri
### ✔️**Seçenekler**
![secenekler](https://i.hizliresim.com/pj4dzre.png)

##### ✔️**liste:** *(String)* - Gerekli
Listeden veriler alınıp sitede seçenek formatına dönüştürülür.
`{ "Liste Elemanı 1": "Dönen Veri", "Liste Elemanı 2": "Dönen Veri 2" }`

##### ✔️**devredisi:** *(Boolean)* - Opsiyonel
Geçici olarak devre dışı bırakmak içindir.
`true/false`

##### ↩️**Response:** *(Dönen veri)* 
`String`

### 📝**Giriş**
![girisHeader](https://i.hizliresim.com/ol4sqab.png)

##### ✔️**placeholder:** *(String)* - Opsiyonel
Lütfen veri giriniz gibi gözüken kısım.
`...giris("Lütfen veri giriniz...", )...`

##### ✔️**min:** *(Number)* - Opsiyonel
Minimum karakter sayısı. *(En az girilebilecek karakter sayısı)*

##### ✔️**max:** *(Number)* - Opsiyonel
Maksimum karakter sayısı. *(en fazla girilebilecek karakter)*

##### ✔️**devredisi:** *(Boolean)* - Opsiyonel
Geçici olarak devre dışı bırakmak içindir.
`true/false`

##### ✔️**gerekli:** *(Boolean)* - Opsiyonel
Veri illahki girilecek diyorsanız `true` yapmalısınız.
`true/false`

##### ↩️**Response:** *(Dönen veri)* 
`String`

### 📝**Metin Girişi**
![metingirisiHeader](https://i.hizliresim.com/pgjvghn.png)

##### ✔️**placeholder:** *(String)* - Opsiyonel
Lütfen veri giriniz gibi gözüken kısım.
`...metingirisi("Lütfen veri giriniz...", )...`

##### ✔️**min:** *(Number)* - Opsiyonel
Minimum karakter sayısı. *(en az girilecek karakter)*

##### ✔️**max:** *(Number)* - Opsiyonel
Maksimum karakter sayısı. *(en fazla girilecek karakter)*

##### ✔️**devredisi:** *(Boolean)* - Opsiyonel
Geçici olarak devre dışı bırakmak içindir.
`true/false`

##### ✔️**gerekli:** *(Boolean)* - Opsiyonel
Veri illahki girilecek diyorsanız `true` yapmalısınız.
`true/false`

##### ↩️**Response:** *(Dönen veri)* 
`String`

### ✔️**Tik(Switch)**
![tikHeader](https://i.hizliresim.com/t04hk1l.png)

##### ✔️**durusDurum:** *(Boolean)* - Opsiyonel
Normalde kapalı mı açık mı diye belirler.
`true/false`

##### ✔️**devredisi:** *(Boolean)* - Opsiyonel
Geçici olarak devre dışı bırakmak içindir.
`true/false`

##### ↩️**Response:** *(Dönen veri)* 
`Boolean`

### 🌈Renk Seçici(Collector)
![renkHeader](https://i.hizliresim.com/napz3vd.png)

##### ✔️**durusDurum:** *(HEX, String)* - Opsiyonel
Kullanıcı eli ile rengi seçmezse olacak renktir *(Ayarlamazsanız orijinal renk #ffffff olarak ayarlanır).*
`#f1016c`

##### ✔️**devredisi:** *(Boolean)* - Opsiyonel
Geçici olarak devre dışı bırakmak içindir.
`true/false`

##### ✔️**Response:** *(Dönen veri)* 
`String` *(HEX rengi tipinde döndürür - # içerir. Örnek: #f1f1f1)*

### #**Kanal Secici**
![kanalSecHeader](https://i.hizliresim.com/i093k9i.png)

##### ✔️**devredisi:** *(Boolean)* - Opsiyonel
Geçici olarak devre dışı bırakmak içindir.
`true/false`

##### ↩️**Response:** *(Dönen veri)* 
`String` *(Kanal ID)*

### 🕴️**Rol Seçici**
![rolHeader](https://i.hizliresim.com/9etox6h.png)

##### ✔️**devredisi:** *(Boolean)* - Opsiyonel
Geçici olarak devre dışı bırakmak içindir.
`true/false`

##### ↩️**Response:** *(Dönen veri)* 
`String` *(Rol ID)*

## ![discord](https://images.sftcdn.net/images/t_app-logo-s,f_auto/p/f4c4dac6-c830-11e6-bd9d-599bf3caf9c2/162521750/discord-icon.png)Discord

Size anlattığımız Discord verilerine ihtiyacımız bulunmakta. Başka birşeye ihtiyacımız yok.

### 🤖Bot oluşturma
![createBot](https://i.hizliresim.com/7w3ch02.gif)
* [Discord Geliştirici Portalı](https://discord.com/developers/applications)'na giriş yapın
* Var olan botunuza girin veya yeni bir bot açın
* Aşağıdaki verileri alın:

#### 🤫Client ID ve Client Secret
![clientidscr](https://i.hizliresim.com/gg6jbj2.gif)
* "OAuth2" sekmesine gidin
* "Client ID"yi kopyalayın.
* "Client Secret"i kopyalayın
**KİMSEYE SÖYLEMEYİN**
#### 🤫Discord Bot Token
![token](https://i.hizliresim.com/ijeuk9r.gif)
* "Bot" sekmesine gidin
* Bot oluşturun veya var olan botunuza gidin
* "TOKEN"i kopyalayın
**KİMSEYE SÖYLEMEYİN**
#### ↩️Yönlendirme Linki Ekleme
![redirect](https://i.hizliresim.com/tfiwzpk.gif)
* "OAuth2" sekmesine gidin.
* REDIRECTS alanına gidin, domaininizi şu şekilde ekleyin: http://domain.com/discord/callback, http://domain.com/manage (ayrıca HTTPS domainleri ekleyebilirsin. Eğer PORT adresin 80, 442 veya 443 değilse, domaininizin sonuna portunuzu ekleyin. Çoğu durumda gerek yoktur. [Örn: http://domain.com:892/discord/callback], 'domain.com' yerine domaininizi koyun veya 'localhost' koyarak kendi bilgisayarınızda çalıştırın.)
* Save changes
* Bu URL'ler artık kaydedildi. Bu URL'ler üzerinden çalıştırabilirsiniz.

# İletişim
[Instagram](https://instagram.com/atailh4n): @atailh4n
Discord:Ata İlhan#2077