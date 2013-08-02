/**
 * Turntable.fm Auto Awesome Script
 * Created by Izzmo, http://github.com/izzmo/AutoAwesomer
 * Last Updated: August 2nd, 2013
 * 
 * If you have any questions or concerns,
 * please email me: me@izzmo.com, or find
 * me in http://tt.fm/dubstep
 */

$(document).ready(function() {
  if(window.izzmo == undefined) window.izzmo = { };
  
  window.izzmo = $.extend(window.izzmo, {
    ttObj: null,
    awesomer: null,
    showArc: true,
    lamed: false,
    arcInt: 0,
    deg: 0.0,
    vote: function(c) {
      var f = $.sha1(window.izzmo.ttObj.roomId + c + window.izzmo.ttObj.currentSong._id);
      var d = $.sha1(Math.random() + "");
      var e = $.sha1(Math.random() + "");
      window.izzmo.socket({
          api: "room.vote",
          roomid: window.izzmo.ttObj.roomId,
          section: window.izzmo.ttObj.section,
          val: c,
          vh: f,
          th: d,
          ph: e
      });
    },
    socket: function (c, a) {
        if (c.api == "room.now") {
            return;
        }
        c.msgid = turntable.messageId;
        turntable.messageId += 1;
        c.clientid = turntable.clientId;
        if (turntable.user.id && !c.userid) {
            c.userid = turntable.user.id;
            c.userauth = turntable.user.auth;
        }
        var d = JSON.stringify(c);
        if (turntable.socketVerbose) {
            LOG(util.nowStr() + " Preparing message " + d);
        }
        var b = $.Deferred();
        turntable.whenSocketConnected(function () {
            if (turntable.socketVerbose) {
                LOG(util.nowStr() + " Sending message " + c.msgid + " to " + turntable.socket.host);
            }
            if (turntable.socket.transport.type == "websocket") {
                turntable.socketLog(turntable.socket.transport.sockets[0].id + ":<" + c.msgid);
            }
            turntable.socket.send(d);
            turntable.socketKeepAlive(true);
            turntable.pendingCalls.push({
                msgid: c.msgid,
                handler: a,
                deferred: b,
                time: util.now()
            });
        });
        return b.promise();
    },
    listener: function(d) {
      if(d.command == 'newsong' && d.room.metadata.current_dj != window.turntable.user.id) {
        clearTimeout(window.izzmo.awesomer);
        clearInterval(window.izzmo.arcInt);
        window.izzmo.lamed = false;
        var timeAmt = Math.floor(Math.random()*window.izzmo.ttObj.currentSong.metadata.length/4*1000);
        window.izzmo.botMessage.find('span').html('');
        window.izzmo.awesomer = setTimeout(function() {
          window.izzmo.vote('up');
        }, timeAmt);
        
        if(!window.izzmo.showArc) return;

        window.izzmo.deg = 0.0;
        window.izzmo.degAmt = 180 / timeAmt * 55;
        if(window.izzmo.arcInt != 0) {
          clearInterval(window.izzmo.arcInt);
          window.izzmo.arcInt = 0;
        }
        window.izzmo.arcInt = setInterval(function() {
          if(window.izzmo.deg >= 180) {
            clearInterval(window.izzmo.arcInt);
            window.izzmo.arcInt = 0;
          }
          window.izzmo.setArc(window.izzmo.deg, false);
          window.izzmo.deg += window.izzmo.degAmt;
        }, 50);
      }
      else if(d.command == 'update_votes') {
        $.each(d.room.metadata.votelog, function() {
          if(this[0] == window.turntable.user.id) {
            window.izzmo.stop();
            window.izzmo.setArc(180, 'down' === this[1]);
            return false;
          }
        });     
      }
    },
    setArc: function(degree, red) {
      if(!window.izzmo.showArc) return;
      var context = window.izzmo.arc[0].getContext('2d'), $arc = $(window.izzmo.arc);
      context.clearRect(0, 0, 1000, 1000);
      context.beginPath();
      context.arc($arc.width()/2, $arc.height()+7, $arc.height()+2, -Math.PI, degree*Math.PI/180 - Math.PI, false);
      context.lineWidth = 2;
      if(red)
        context.strokeStyle = 'rgb(255, 0, 0)';
      else
        context.strokeStyle = 'rgb(0, 200, 0)';
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = 10;
      if(red)
        context.shadowColor = 'rgba(255, 0, 0, 1)';
      else
        context.shadowColor = 'rgba(0, 255, 0, 1)';
      context.stroke();
    },
    room: '',
    watcher: null,
    stop: function() {
      clearTimeout(window.izzmo.awesomer);
      clearInterval(window.izzmo.arcInt);
      window.izzmo.arcInt = 0;
    },
    awesome: function() {
      window.izzmo.vote('up');
      window.izzmo.stop();
      window.izzmo.setArc(180, false);
    },
    lame: function() {
      if(!window.izzmo.lamed) {
        window.izzmo.vote('up');
        window.izzmo.stop();
        window.izzmo.botMessage.find('span').html("Song lamed! Awesomering will resume next song.");
        window.izzmo.lamed = true;
      }
      window.izzmo.setArc(180, true);
      setTimeout(function() {window.izzmo.vote('down');}, 250);
    },
    init: function() {
      console.log('Initializing AutoAwesomer.');
      $('.roomView').ready(function() {
        window.izzmo.ttObj = window.turntable.buddyList.room;
        if(window.izzmo.ttObj === null) {
          alert('Could not find turntable.fm objects. You should refresh your page and try again.');
          return;
        }
        window.izzmo.room = window.location.pathname;
        console.log('Setting up AwesomeArc...');
        var meterObj = $('.awesome-meter').first();
        if(meterObj.length && meterObj.css('display') != 'none') {
          var top = meterObj[0].style.top,
              left = meterObj[0].style.left;
          window.izzmo.arc = $('<canvas id="izzmo-arc" width="' + meterObj.width() + '" height="' + parseInt(meterObj.height()*0.39) + '" style="overflow: hidden; position: absolute; z-index: 20000; top: ' + top + '; left: ' + left + ';">Izzmo\'s AutoAwesome</canvas>');
          window.izzmo.arc.prependTo(meterObj.parent());
          window.izzmo.showArc = true;
        }
        else {
          console.log('Could not find awesome-meter.');
          window.izzmo.showArc = false;
        }
        
        console.log('Configuring AutoAwesomer message bar...');
        window.izzmo.botMessage = $('<div id="bot-message">Izzmo\'s AutoAwesome. <span style="font-style: italic;"></span> <a href="#" style="text-decoration: none; color: red; font-weight: bold;">Turn off</a></div>');
        window.izzmo.botMessage.css({
          position: 'absolute',
          left: '68px',
          top: '-17px',
          width: '100%',
          color: 'white',
          zIndex: '5000',
          textAlign: 'left',
          paddingLeft: '2px',
          paddingTop: '2px',
          paddingRight: '3px',
          paddingBottom: '2px',
          fontSize: '10px',
          fontFace: 'Verdana'
        });
        $('.header-content').first().append(window.izzmo.botMessage);
        
        console.log('Setting up AutoAwesomer click events...');
        window.izzmo.botMessage.find('a').click(function(e) {
          e.preventDefault();
          window.izzmo.destruct();
          window.turntable.removeEventListener("message", window.izzmo.listener);
          window.izzmo = null;
        });

        // cancel TT's default callback for the lame button, add in our own.
        $('#lame-button').unbind().bind('click', function() {
          window.izzmo.lame();
        });

        turntable.addEventListener("message", window.izzmo.listener);
        window.izzmo.awesome(); // automatically awesome the song upon load

        // Timer for resetting Turntable's AFK Timers
        // Runs every 60 seconds
        console.log('Turning on AutoAwesomer anti-idle.');
        window.izzmo.botResetAFKTimer = setInterval(function() {
          $(window).focus();
        }, 60000);

        window.izzmo.watcher = setInterval(function() {
          if(/^\/[a-zA-Z0-9_]+$/.test(window.location.pathname) && window.location.pathname != window.izzmo.room) {
            console.log('New Room found, reinitializing...');
            window.izzmo.destruct();
            if(window.izzmo.showArc) {
              var meterObj = $('#awesome-meter');
              var check = setInterval(function() {
                if(meterObj.length > 0 && meterObj.css('display') != 'none') {
                  window.izzmo.init();
                  clearInterval(check);
                }
              }, 1000);
              setTimeout(function() {clearInterval(check);}, 10000);
            }
          }
        }, 3000);
        console.log('AutoAwesomer setup complete.');
      });
    },
    destruct: function() {
      console.log('Turning off AutoAwesomer.');
      clearInterval(window.izzmo.botResetAFKTimer);
      clearInterval(window.izzmo.watcher);
      window.izzmo.stop();
      window.izzmo.arc.remove();
      window.izzmo.botMessage.remove();
    }
  });
  
  window.izzmo.init();
});
