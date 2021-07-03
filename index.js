"use strict"

const fs = require('fs-extra')
const yaml = require('js-yaml')
const Twig = require('twig')

function walkSync(currentDirPath, callback) {
    var fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(name, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

try
{
    // Flush Web Folder
    fs.emptyDirSync('web/')

    // Copy Assets to web folder
    fs.copySync('themes/default/assets', 'web/assets')
    fs.copySync('data/img', 'web/img')
    
    // Load Database
    let sidebar = {}
    let sitemap = {}
    let options = yaml.safeLoad(fs.readFileSync('data/options.yml', 'utf8'));
    let me = yaml.safeLoad(fs.readFileSync('data/me.yml', 'utf8'));
    let pages = yaml.safeLoad(fs.readFileSync('data/pages.yml', 'utf8'));
    let posts = yaml.safeLoad(fs.readFileSync('data/posts.yml', 'utf8'));

    //console.log(options, me, pages, posts)

    // Render Pages
    if(pages.length > 0) {
        pages.forEach(item => {
            Twig.renderFile(
                './themes/' + options.theme + '/views/' + item.template + '.html.twig',
                {
                    item: item, 
                    pages: pages,
                    options: options,
                    me: me,
                    settings: { "twig options": { async: false} }
                },
                (err, html) => {
                    //console.log('Twig', err, html)
                    if(err) throw err
            
                    fs.writeFile('web/' + item.slug +'.html', html, 'utf8', function (err) {
                        if (err) throw err
                    });
                }
            )
        })
    }

    // Render Posts
    if(posts.length > 0) {
        posts.forEach(item => {
            Twig.renderFile(
                './themes/' + options.theme + '/views/' + item.template + '.html.twig',
                {
                    item: item, 
                    pages: pages,
                    options: options,
                    me: me,
                    settings: { "twig options": { async: false} }
                },
                (err, html) => {
                    //console.log('Twig', err, html)
                    if(err) throw err
            
                    fs.writeFile('web/' + item.slug +'.html', html, 'utf8', function (err) {
                        if (err) throw err
                    });
                }
            )
        })
    }

    // Render Homepage
    Twig.renderFile(
        './themes/' + options.theme + '/views/index.html.twig',
        {
            posts: posts,
            pages: pages,
            options: options,
            me: me,
            settings: { "twig options": { async: false} }
        },
        (err, html) => {
            //console.log('Twig', err, html)
            if(err) throw err
    
            fs.writeFile('web/index.html', html, 'utf8', function (err) {
                if (err) throw err
            });
        }
    )

    // Render Sitemap
    
/*
    // FTP
    //let dirname = 'web/';
    const Client = require('ftp');
    const ftp = new Client();
    ftp.on('ready', function() {
        walkSync('web', function(filePath, stat) {
            // do something with "filePath"...
            console.log(filePath, stat);
            ftp.put(filePath, filePath, function(err) {
                if (err) throw err;
            });
        });

        ftp.end();
    });
    ftp.connect({
        host: 'ftp.domain.com',
        port: 20,
        user: 'username@domain.com',
        password: 'ftppassword'
    });
*/
} catch (e) {
    console.log(e)
}