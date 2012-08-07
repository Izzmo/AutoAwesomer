/**
 * Turntable.fm Auto Awesome Script
 * Created by Izzmo, http://github.com/izzmo/AutoAwesomer
 * Last Updated: August 7th, 2012
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
      if(d.command == 'newsong' && d.room.metadata.current_dj != izzmo.ttObj.selfId) {
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
            window.izzmo.setArc(180, this[1] == "down");
          }
        });     
      }
    },
    setArc: function(degree, red) {
      if(!window.izzmo.showArc) return;
      var context = window.izzmo.arc[0].getContext('2d');
      context.clearRect(0, 0, 1000, 500);
      context.beginPath();
      context.arc(203, 162, 137, -Math.PI, degree*Math.PI/180 - Math.PI, false);
      context.lineWidth = 5;
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
      $('.roomView').ready(function() {
        for(var prop in window.turntable) {
          if(window.turntable[prop] != undefined && window.turntable[prop].hasOwnProperty('currentDj'))
            window.izzmo.ttObj = window.turntable[prop];
        }
        if(window.izzmo.ttObj === null) {
          alert('Could not find turntable.fm objects. You should refresh your page and try again.');
          return;
        }
        window.izzmo.room = window.location.pathname;
        var meterObj = $('#meterGauge');
        if(meterObj.length > 0 && meterObj.css('display') != 'none') {
          var meter = $('#meterGauge').position();
          window.izzmo.arc = $('<canvas id="izzmo-arc" width="406" height="158" style="overflow: hidden; position: absolute; z-index: 20000; top: ' + meter.top + 'px; left: ' + meter.left + 'px;">Izzmo\'s AutoAwesome</canvas>');
          $($('.roomView > div')[1]).prepend(window.izzmo.arc);
          window.izzmo.showArc = true;
        }
        else
          window.izzmo.showArc = false;

        window.izzmo.botMessage = $('<div id="bot-message">Izzmo\'s AutoAwesome. <span style="font-style: italic;"></span> <a href="#" style="text-decoration: none; color: red; font-weight: bold;">Turn off</a></div>');
        window.izzmo.botMessage.css({
          position: 'fixed',
          color: 'white',
          top: '0px',
          zIndex: '5000',
          textAlign: 'left',
          paddingLeft: '2px',
          paddingTop: '2px',
          paddingRight: '3px',
          paddingBottom: '2px',
          fontSize: '10px',
          fontFace: 'Verdana'
        });
        $('.header').append(window.izzmo.botMessage);
        
        window.izzmo.botMessage.find('a').click(function(e) {
          e.preventDefault();
          window.izzmo.destruct();
          window.turntable.removeEventListener("message", window.izzmo.listener);
          window.izzmo = null;
        });

        var buttons = $('.roomView > div:nth-child(2) a[id]'); // 1st is Awesome button, 2nd is Lame
        $(buttons[1]).unbind(); // cancel TT's default callback for the lame button, add in our own.
        $(buttons[1]).bind('click', function() {
          window.izzmo.lame();
        });

        turntable.addEventListener("message", window.izzmo.listener);
        window.izzmo.awesome(); // automatically awesome the song upon load

        // Timer for resetting Turntable's AFK Timers
        // Runs every 60 seconds
        window.izzmo.botResetAFKTimer = setInterval(function() {
          $($('form input:last')[0]).keydown();
        }, 60000);

        window.izzmo.watcher = setInterval(function() {
          if(window.location.pathname != window.izzmo.room) {
            console.log('New Room found, reinitializing...');
            window.izzmo.destruct();
            if(window.izzmo.showArc) {
              var meterObj = $('#meterGauge');
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
      });
    },
    destruct: function() {
      clearInterval(window.izzmo.botResetAFKTimer);
      clearInterval(window.izzmo.watcher);
      window.izzmo.stop();
      window.izzmo.arc.remove();
      window.izzmo.botMessage.remove();
    }
  });
  
  window.izzmo.init();
});
