/// @ts-check

// format for console log when inspecting json
// console.log(inspect(authors, { colors: true, depth: Infinity }));

const fetch = require("node-fetch");
const parse = require("xml-parser");
const slugify = require("slugify");
const yaml = require("js-yaml");
const fs = require("fs");
const getargs = require("minimist");
const inspect = require("util").inspect; // this is only here to inspect the json during debugging

const TODAY = new Date();
const CATEGORIES = [
  { id: "kodi.audiodecoder", desc: "Audio decoders" },
  { id: "kodi.audioencoder", desc: "Audio encoders" },
  { id: "kodi.context.item", desc: "Context menus" },
  { id: "kodi.gameclient", desc: "Game clients" },
  { id: "kodi.game.controller", desc: "Controller profiles" },
  { id: "kodi.imagedecoder", desc: "Image decoders" },
  { id: "kodi.inputstream", desc: "Script Libraries" },
  { id: "kodi.metadata.scraper.library", desc: "Script Libraries" },
  { id: "kodi.metadata.scraper.albums", desc: "Album information providers" },
  { id: "kodi.metadata.scraper.artists", desc: "Artist information providers" },
  { id: "kodi.metadata.scraper.movies", desc: "Movie information providers" },
  {
    id: "kodi.metadata.scraper.musicvideos",
    desc: "Music video information providers",
  },
  { id: "kodi.metadata.scraper.tvshows", desc: "TV information providers" },
  { id: "kodi.python.library", desc: "Script Libraries" },
  { id: "kodi.resource.images", desc: "Image collections" },
  { id: "kodi.resource.language", desc: "Languages" },
  { id: "kodi.ui.screensaver", desc: "Screensavers" },
  { id: "kodi.gui.skin", desc: "Skins" },
  { id: "kodi.resource.uisounds", desc: "GUI sounds" },
  { id: "kodi.python.lyrics", desc: "Lyrics" },
  { id: "kodi.python.module", desc: "Python modules" },
  { id: "kodi.pvrclient", desc: "PVR clients" },
  { id: "kodi.service", desc: "Services" },
  { id: "kodi.subtitle.module", desc: "Subtitles" },
  { id: "kodi.vfs", desc: "Virtual filesystems" },
  { id: "kodi.player.musicviz", desc: "Visualisations" },
  { id: "kodi.python.weather", desc: "Weather providers" },
  { id: "kodi.webinterface", desc: "Web interfaces" },
  { id: "xbmc.audiodecoder", desc: "Audio decoders" },
  { id: "xbmc.audioencoder", desc: "Audio encoders" },
  { id: "xbmc.context.item", desc: "Context menus" },
  { id: "xbmc.gameclient", desc: "Game clients" },
  { id: "xbmc.game.controller", desc: "Controller profiles" },
  { id: "xbmc.imagedecoder", desc: "Image decoders" },
  { id: "xbmc.inputstream", desc: "Script Libraries" },
  { id: "xbmc.metadata.scraper.library", desc: "Script Libraries" },
  { id: "xbmc.metadata.scraper.albums", desc: "Album information providers" },
  { id: "xbmc.metadata.scraper.artists", desc: "Artist information providers" },
  { id: "xbmc.metadata.scraper.movies", desc: "Movie information providers" },
  {
    id: "xbmc.metadata.scraper.musicvideos",
    desc: "Music video information providers",
  },
  { id: "xbmc.metadata.scraper.tvshows", desc: "TV information providers" },
  { id: "xbmc.python.library", desc: "Script Libraries" },
  { id: "xbmc.resource.images", desc: "Image collections" },
  { id: "xbmc.resource.language", desc: "Languages" },
  { id: "xbmc.ui.screensaver", desc: "Screensavers" },
  { id: "xbmc.gui.skin", desc: "Skins" },
  { id: "xbmc.resource.uisounds", desc: "GUI sounds" },
  { id: "xbmc.python.lyrics", desc: "Lyrics" },
  { id: "xbmc.python.module", desc: "Python modules" },
  { id: "xbmc.pvrclient", desc: "PVR clients" },
  { id: "xbmc.service", desc: "Services" },
  { id: "xbmc.subtitle.module", desc: "Subtitles" },
  { id: "xbmc.vfs", desc: "Virtual filesystems" },
  { id: "xbmc.player.musicviz", desc: "Visualisations" },
  { id: "xbmc.python.weather", desc: "Weather providers" },
  { id: "xbmc.webinterface", desc: "Web interfaces" },
];
/** @type {any[]} */
let history = [];
/** @type {any[]} */
let kodiversion = "";
let kodimirror = "http://ftp.halifax.rwth-aachen.de/xbmc/addons/";
let kodistats = "http://mirrors.kodi.tv/.stats/redis_file_stats.json";
let gitHubStats = "https://api.github.com/repos/xbmc/xbmc/commits?per_page=1";
let forumStats = "https://forum.kodi.tv/stats.php";
/** @type {import("../../src/addon").IAddon} */
let addon = {};
/** @type {import("../../src/addon").IAddon[]} */
let addons = [];
// let featured = { addons: [] }
/** @type {any[]} */
let authors = [];
/** @type {any[]} */
let categories = [];
let addonpath = "";
let addonplatform = "";
let addonstats = "";
/** @type {string[]} */
let addonimagetypes = [];
let downloadqueue = [];
let versiondownloads = 0;
let gatsbyroot = "../../";
let pixiememory = gatsbyroot + "src/data/addons/";
let statslocation = gatsbyroot + "src/data/yaml/stats/stats.yaml";
let addonnodetype = "";
let authornodetype = "";
let categorynodetype = "";
let data = "";

async function loadHistoryFile() {
  return new Promise(function (resolve, reject) {
    let ah;
    console.log("loading addons.json from " + pixiememory);
    try {
      ah = JSON.parse(fs.readFileSync(pixiememory + "addons.json", "utf8"));
    } catch (e) {
      console.log("unable to load history, starting from scratch");
      ah = [{}];
    }
    resolve(ah);
  });
}

function getAddon(rawaddon) {
  let firstever = false;
  addon = addons.find(o => o.id === rawaddon.attributes.id);
  addonpath = "";
  addonplatform = "";
  addonimagetypes = [];
  if (addon == undefined) {
    addon = {};
    addon.id = rawaddon.attributes.id;
    addon.addonid = addon.id;
    addon.name = rawaddon.attributes.name;
    addon.slug = slugify(rawaddon.attributes.id, { lower: true });
    addon.version = rawaddon.attributes.version;
    addon.authors = [];
    addon.platforms = [];
    addon.categories = [];
    if (rawaddon.attributes["provider-name"] != undefined) {
      rawaddon.attributes["provider-name"]
        .split(",")
        .map(item => item.trim())
        .forEach(assignAuthor);
    }
    let addonhistory = history.find(o => o.id === addon.id);
    if (addonhistory == undefined) {
      addonhistory = {};
      addonhistory.id = addon.id;
      addonhistory.version = "none";
      addonhistory.lastupdate = TODAY;
      addonhistory.firstseen = TODAY;
      addonhistory.agetype = "new";
      addonhistory.downloads = 0;
      firstever = true;
    }
    addon.firstseen = addonhistory.firstseen;
    addon.agetype = addonhistory.agetype;
    rawaddon.children.forEach(parseExtensions);
    if (addon.version == addonhistory.version) {
      addon.lastupdate = addonhistory.lastupdate;
      addon.downloads = addonhistory.downloads;
    } else {
      addon.lastupdate = TODAY;
      if (!firstever) {
        addon.agetype = "existing";
      }
      addon.downloads = 0;
      addon.prevyeardl = 0;
      if (addon.broken == null) {
        queueImages();
      }
    }
    if (addon.broken == null) {
      if (addon.icons == null) {
        addon.icons = [{ remotepath: "", localpath: "/images/default-addon.webp" }];
      }
      addon.icon = addon.icons[0].localpath;
      cleanUpDescriptions();
      addons.push(addon);
      addon.authors.forEach(createAuthorNode);
      addon.categories.forEach(createCategoryNode);
    }
  } else {
    rawaddon.children.forEach(parseExtensions);
  }
}

function cleanUpDescriptions() {
  let regex = /\[(COLOR|CR|B|I)\]/g;
  let maxwords = 15;
  let summary = "";
  let description = "";
  if (addon.summary != undefined) {
    addon.summary = addon.summary.replace(regex, " ");
    summary = addon.summary;
  }
  if (addon.description != undefined) {
    addon.description = addon.description.replace(regex, " ");
    description = addon.description;
  } else if (summary != "") {
    addon.description = summary;
    description = addon.description;
  }
  if (summary != "") {
    addon.snippet = summary;
  } else {
    addon.snippet = description;
  }
  let sList = addon.snippet.split(" ");
  if (sList.length > maxwords) {
    sList.splice(maxwords);
    addon.snippet = sList.join(" ") + "...";
  }
}

function parseExtensions(extension) {
  if (extension.name == "extension") {
    switch (extension.attributes.point) {
      case "kodi.addon.metadata":
        extension.children.forEach(getMetadata);
        addon.platforms.push({
          platform: addonplatform,
          path: addonpath,
          statspath: addonstatspath,
        });
        break;
      case "xbmc.addon.metadata":
        extension.children.forEach(getMetadata);
        addon.platforms.push({
          platform: addonplatform,
          path: addonpath,
          statspath: addonstatspath,
        });
        break;
      case "kodi.python.pluginsource":
        assignCategory("Plugins");
        checkProvides(extension.children);
        break;
      case "xbmc.python.pluginsource":
        assignCategory("Plugins");
        checkProvides(extension.children);
        break;
      case "kodi.python.script":
        assignCategory("Program addons");
        checkProvides(extension.children);
        break;
      case "xbmc.python.script":
        assignCategory("Program addons");
        checkProvides(extension.children);
        break;
      default:
        cat = CATEGORIES.find(o => o.id === extension.attributes.point);
        if (cat != undefined) {
          assignCategory(cat.desc);
        }
    }
  }
}

function checkProvides(provider) {
  if (provider.length > 0) {
    if (provider[0].content == undefined) {
      return;
    }
    if (provider[0].content.includes("audio")) {
      assignCategory("Music addons");
    }
    if (provider[0].content.includes("video")) {
      assignCategory("Video addons");
    }
    if (provider[0].content.includes("image")) {
      assignCategory("Picture addons");
    }
    if (provider[0].content.includes("executable")) {
      assignCategory("Program addons");
    }
  }
}

function createAuthorNode(author) {
  newauthor = JSON.parse(JSON.stringify(author));
  authorcheck = authors.find(o => o.id === newauthor.name);
  if (authorcheck == undefined) {
    newauthor.id = newauthor.name;
    newauthor.addons = [addon];
    authors.push(newauthor);
  } else {
    addoncheck = authorcheck.addons.find(o => o.id === addon.id);
    if (addoncheck == undefined) {
      authorcheck.addons.push(addon);
    }
  }
}

function createCategoryNode(category) {
  newcategory = JSON.parse(JSON.stringify(category));
  categorycheck = categories.find(o => o.id === newcategory.name);
  if (categorycheck == undefined) {
    newcategory.id = newcategory.name;
    newcategory.grouping = setCategoryGrouping(newcategory.name);
    newcategory.addons = [addon];
    categories.push(newcategory);
  } else {
    addoncheck = categorycheck.addons.find(o => o.id === addon.id);
    if (addoncheck == undefined) {
      categorycheck.addons.push(addon);
    }
  }
}

function setCategoryGrouping(name) {
  switch (name.toLowerCase()) {
    case "game clients":
      return "Games";
    case "controller profiles":
      return "Games";
    case "album information providers":
      return "Information providers";
    case "artist information providers":
      return "Information providers";
    case "movie information providers":
      return "Information providers";
    case "music video information providers":
      return "Information providers";
    case "tv information providers":
      return "Information providers";
    case "image collections":
      return "Look and feel";
    case "languages":
      return "Look and feel";
    case "screensavers":
      return "Look and feel";
    case "skins":
      return "Look and feel";
    case "gui sounds":
      return "Look and feel";
    default:
      return "Other";
  }
}

function assignAuthor(author) {
  authorcheck = addon.authors.find(o => o.name === author);
  if (authorcheck == undefined) {
    slug = slugify(author, { lower: true });
    icon = "/images/authors/" + slug + ".webp";
    addon.authors.push({ name: author, slug: slug, icon: icon });
  }
}

function assignCategory(category) {
  categorycheck = addon.categories.find(o => o.name === category);
  if (categorycheck == undefined) {
    slug = slugify(category, { lower: true });
    icon = "/images/categories/" + slug + ".webp";
    addon.categories.push({ name: category, slug: slug, icon: icon });
  }
}

function getMetadata(metadata) {
  if (metadata.name == "summary" || metadata.name == "description") {
    if (metadata.attributes.lang == "en_GB") {
      addon[metadata.name] = metadata.content;
    }
  } else if (metadata.name == "size") {
    addon[metadata.name] =
      String(Math.floor(Number(metadata.content) / 1024)) + "KB";
  } else if (metadata.name == "path") {
    addonpath = kodimirror + metadata.content;
    addonstatspath = "/addons/" + kodiversion + "/" + metadata.content;
  } else if (metadata.name == "platform") {
    addonplatform = metadata.content;
  } else if (metadata.name == "assets") {
    metadata.children.forEach(getAssets);
  } else {
    addon[metadata.name] = metadata.content;
  }
}

function getAssets(asset) {
  let assetcheck = undefined;
  let arrayname = asset.name + "s";
  if (addon[arrayname] == undefined) {
    addon[arrayname] = [];
    addonimagetypes.push(arrayname);
  } else {
    assetcheck = addon[arrayname].find(o => o.remotepath === asset.content);
  }
  if (assetcheck == undefined) {
    imagepath =
      "/images/addons/" +
      kodiversion +
      "/" +
      slugify(addon.id, { lower: true }) +
      "/" +
      asset.content;
    addon[arrayname].push({ localpath: imagepath, remotepath: asset.content });
  }
}

function doCleanup(item) {
  item.addons.sort(compare);
  item.totaladdons = item.addons.length;
}

function compare(a, b) {
  const bandA = a.name.toUpperCase();
  const bandB = b.name.toUpperCase();
  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;
}

function queueImages() {
  addonimagetypes.forEach(queueImageType);
}

function queueImageType(imagetype) {
  const fullurl = addon.platforms[0].path;
  const urlbase = fullurl.substring(0, fullurl.lastIndexOf("/")) + "/";
  const rootpath = gatsbyroot + "static";
  addon[imagetype].forEach(asset => {
    const localpath = asset.localpath;
    const localbase =
      rootpath + localpath.substring(0, localpath.lastIndexOf("/")) + "/";
    downloadqueue.push({
      remote: urlbase + asset.remotepath,
      localdir: localbase,
      local: rootpath + asset.localpath,
    });
  });
}

function getDownloadCount() {
  if (addon.downloads === undefined) {
    addon.downloads = 0;
  }
}

async function app() {
  const args = getargs(process.argv.slice(2));
  if (args["kv"] == undefined) {
    console.log("kodi version not included on command line");
    console.log("use --kv=<version>");
    return;
  }
  console.log("kodi version from command line is " + args["kv"]);
  kodiversion = args["kv"];
  kodimirror = kodimirror + kodiversion + "/";
  pixiememory = pixiememory + kodiversion + "/";
  history = await loadHistoryFile();
  console.log(
    "getting addons from the " + kodiversion + " repo using " + kodimirror
  );
  try {
    const res = await fetch(kodimirror + "addons.xml");
    data = await res.text();
  } catch (error) {
    data = "";
    console.log(error);
  }
  console.log("getting addon download stats from " + kodistats);
  try {
    const res = await fetch(kodistats);
    rawstats = await res.json();
    let firstKey = Object.keys(rawstats[0])[0];
    addonstats = rawstats[0][firstKey];
  } catch (error) {
    addonstats = {};
    console.log(error);
  }
  if (data) {
    const parsedXML = parse(data);
    console.log("parsing addon data");
    parsedXML.root.children.forEach(getAddon);
    authors.forEach(doCleanup);
    categories.forEach(doCleanup);
    for (let i = 0; i < downloadqueue.length; i++) {
      let createddir = false;
      let download = downloadqueue[i];
      await fs.mkdir(download.localdir, { recursive: true }, err => {
        if (err) {
          console.log("create failed for directory" + download.localdir);
        }
      });
      console.log("downloading " + download.remote);
      await fetch(download.remote).then(res => {
        const dest = fs.createWriteStream(download.local);
        res.body.pipe(dest);
      });
    }
    console.log("getting addon download counts");
    for (let i = 0; i < addons.length; i++) {
      let downloadcount = 0;
      for (let k = 0; k < addons[i].platforms.length; k++) {
        let pcstring = addonstats[addons[i].platforms[k].statspath];
        if (pcstring != undefined) {
          let platformcount = parseInt(pcstring);
          downloadcount = downloadcount + platformcount;
        }
      }
      if (downloadcount < addons[i].downloads) {
        // if true a new year has started, which resets the stats
        // we need to figure out if we need to do the rollover or not
        if (
          addons[i].prevyeardl === 0 ||
          addons[i].prevyeardl == undefined ||
          addons[i].prevyeardl + downloadcount < addons[i].downloads
        ) {
          addons[i].prevyeardl = addons[i].downloads;
        }
        addons[i].downloads = addons[i].prevyeardl + downloadcount;
      } else {
        addons[i].downloads = downloadcount;
      }
    }
    console.log("writing addons.json to " + pixiememory);
    fs.writeFileSync(pixiememory + "addons.json", JSON.stringify(addons));
    console.log("writing authors.json to " + pixiememory);
    fs.writeFileSync(pixiememory + "authors.json", JSON.stringify(authors));
    console.log("writing categories.json to " + pixiememory);
    fs.writeFileSync(pixiememory + "categories.json", JSON.stringify(categories));
    if (args["getstats"] != undefined) {
      let stats = "";
      let gitHubCommits = "0";
      let forumThreads = "0";
      console.log("getting commits to xbmc branch from github");
      try {
        await fetch(gitHubStats).then(response => {
          for (var pair of response.headers.entries()) {
            if (pair[0] == "link") {
              stats = pair[1];
              break;
            }
          }
        });
      } catch (error) {
        stats = "";
        console.log(error);
      }
      if (stats) {
        let gitHubRegEx = new RegExp(".*next.*page=(.*)>");
        let gitHubMatch = gitHubRegEx.exec(stats);
        if (gitHubMatch !== null) {
          gitHubCommits = Number(gitHubMatch[1]);
        }
      }
      console.log("getting threads from forum");
      try {
        const forumRes = await fetch(forumStats);
        stats = await forumRes.text();
      } catch (error) {
        stats = "";
        console.log(error);
      }
      if (stats) {
        let forumRegEx = new RegExp("<span .*>(.*)<span>Threads");
        let forumMatch = forumRegEx.exec(stats);
        if (forumMatch !== null) {
          forumThreads = forumMatch[1];
        }
      }
      let statsArray = {};
      statsArray.gitcommits = gitHubCommits.toLocaleString();
      statsArray.forumthreads = forumThreads;
      statsArray.addons = addons.length.toLocaleString();
      let yamlString = yaml.dump(statsArray);
      console.log("writing stats to " + statslocation);
      fs.writeFileSync(statslocation, yamlString, "utf8");
    }
  }
}

app();
