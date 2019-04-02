import ReactGA from 'react-ga';

import React, { Component } from 'react';
import logo from './pill-transparent-pink.png';
import './App.css';

class App extends Component {
  state = {
    width: 800,
    title: 'X-Change',
    caption: `I was coding a web project for fun, but I was having trouble concentrating and kept opening tabs of my favorite subreddits. My roommate had a prescription for adderall, so I took a helping of his pills like I usually do and cracked down at my laptop.\n\nI was so focused, I didn't even notice I'd changed, or that he came into my room until I felt a hand on my ass.`,
    tagline: 'The Fast-Acting, Temporary, Gender-Swapping Pill',
    gif_url: 'https://giant.gfycat.com/BabyishPleasingFantail.webm',
    gif_height_adjust: '35',
    signoff: '-Lucky, not finishing her project',
    accentColor: '#dd2bbc', // Pink: #dd2bbc, Purple: #800080, Blue: #1d61d1
    captionBoxColor: '#ffc0cb', // Pink: #ffc0cb, Purple: #ac62f4, Blue: #acdeff
    show_advanced: false,
    read_only: false,
    render_as_raw: false,
  }

  constructor() {
    super();
    try {
      const url = new URL(window.location.href);
      const read_only = url.searchParams.get('read_only') || false;
      this.state = {
        ...this.state,
        read_only: read_only,
      };

      const data = url.searchParams.get('data');
      const save_data = JSON.parse(Buffer.from(data, 'base64'));
      const {
        title,
        caption,
        tagline,
        gif_url,
        gif_height_adjust,
        signoff,
        render_as_raw,
        accentColor,
        captionBoxColor,
      } = save_data;
      this.state = {
        ...this.state,
        title,
        caption,
        tagline,
        gif_url,
        gif_height_adjust,
        signoff,
        render_as_raw,
        read_only, // not part of save data       
        accentColor,
        captionBoxColor,
      };
    } catch (e) { }
  }

  componentDidMount() {
    // need to defer loading to load font
    ReactGA.initialize('UA-134204838-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
    document.title = 'X-Change Editor';
    window.addEventListener('load', this.draw);
    const url = new URL(window.location.href);
    const data = url.searchParams.get('data');
    if (data == null) {
      this.slowType(` I think he might be a little mad at me for always taking his pills...`);
    }
    this.textArea.focus();
    setInterval(this.poll, 50);
  }

  poll = () => {
    this.forceUpdate();
  }

  slowType(text) {
    if (text.length === 0) {
      return;
    }
    setTimeout(
      () => {
        this.setState(
          prevState => ({caption: prevState.caption + text[0]}),
          () => {
            this.slowType(text.substr(1));
          },
        );
      },
      10,
    );
  }

  componentWillUnmount() {
    // need to defer loading to load font
    window.removeEventListener('load', this.draw);
  }

  componentDidUpdate() {
    this.draw();
  }

  getGifHeight() {
    const gif_height = ((this.gif && this.gif.offsetHeight) || 400)
      - (parseInt(this.state.gif_height_adjust || 0));
    return gif_height;
  }

  getHeight() {
    if (!this.ctx) {
      return 1;
    }
    return this.getGifHeight() + 8 + (this.getCaptionLines().length) * 29 + 48;
  }

  draw = () => {
    this.ctx.clearRect(0, 0, this.state.width, this.getHeight());
    this.drawTitle();
    this.drawTagline();
    this.drawCaptionBox(this.getGifHeight());
    this.drawCaption();
    this.drawSignoff();
  }

  getCaptionLines() {
    const text = this.state.render_as_raw
      ? this.state.caption
      : ('    ' + this.state.caption.replace(/\n+\s*/g, '\n\n    ').trim());
    var i;
    var j;
    var width;
    var max_width = this.state.width - 30;
    var result;
    const textBlocks = text.split('\n');
    const lines = [];

    textBlocks.forEach(text => {
      var words = text.split(" ");
      var currentLine = words[0];
      for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = this.ctx.measureText(currentLine + " " + word).width;
        if (width < max_width) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
    });
    lines.push('');
    return lines;
  }

  drawTitle() {
    const text = this.state.title;
    var x = 16;
    var y = 66;
    this.ctx.font = "bold 64px Aardvark Cafe";
    this.ctx.strokeStyle = this.state.accentColor;
    this.ctx.miterLimit = 8;
    this.ctx.shadowColor = this.state.accentColor;
    this.ctx.shadowBlur = 12;
    this.ctx.lineWidth = 5;
    this.ctx.textAlign = 'left';
    this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(text, x, y);
  }

  drawTagline() {
    const text = this.state.tagline;
    this.ctx.font = "24px Aardvark Cafe";
    this.ctx.strokeStyle = this.state.accentColor;
    this.ctx.miterLimit = 4;
    this.ctx.shadowColor = this.state.accentColor;
    this.ctx.shadowBlur = 2;
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = 'white';

    const x = this.state.width - 8;
    const fontSize = 16;
    const y = this.getGifHeight() - 20;
    const num_lines = this.getCaptionLines().length;
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'right';
    this.ctx.strokeText( text, x, y );
    this.ctx.fillText( text, x, y );
  }

  drawCaptionBox(y) {
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = this.state.captionBoxColor;
    this.ctx.fillRect(0, y, 2000, 2000);
  }

  drawCaption() {
    this.ctx.font = "bold 24px Tahoma";
    this.ctx.strokeStyle = this.state.accentColor;
    this.ctx.miterLimit = 8;
    this.ctx.shadowColor = this.state.accentColor;
    this.ctx.shadowBlur = 2;
    this.ctx.lineWidth = 4;
    this.ctx.fillStyle = 'white';

    const lines = this.getCaptionLines();
    const y = this.getGifHeight();
    const fontSize = 24;
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'left';
    for (let i=0, j=lines.length; i<j; ++i ) {
      this.ctx.strokeText( lines[i], 16, y + fontSize + (fontSize+5) * i + 12);
      this.ctx.fillText( lines[i], 16, y + fontSize + (fontSize+5) * i + 12);
    }
  }

  drawSignoff() {
    const text = this.state.signoff;
    this.ctx.font = "bold 24px Tahoma";
    this.ctx.strokeStyle = this.state.accentColor;
    this.ctx.miterLimit = 8;
    this.ctx.shadowColor = this.state.accentColor;
    this.ctx.shadowBlur = 2;
    this.ctx.lineWidth = 4;
    this.ctx.fillStyle = 'white';

    const x = this.state.width - 16;
    const fontSize = 24;
    const y = this.getGifHeight() + 12;
    const num_lines = this.getCaptionLines().length;
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'right';
    this.ctx.strokeText( text, x, y + fontSize + (fontSize+5) * num_lines );
    this.ctx.fillText( text, x, y + fontSize + (fontSize+5) * num_lines );
  }

  switchVariant(color) {
    switch(color){
      case "pink":
        this.setState({
          accentColor: '#dd2bbc',
          captionBoxColor: '#ffc0cb',
        });
        break;
      case "blue":
        this.setState({
          accentColor: '#1d61d1',
          captionBoxColor: '#acdeff',
        });
        break;
      case "purple":
        this.setState({
          accentColor: '#800080',
          captionBoxColor: '#ac62f4',
        });
        break;
    }
  }

  _renderContent() {
    if (this.state.gif_url.substr(-5) === '.webm') {
      return (
        <video
          ref={ref => {
            if (ref) {
              this.gif = ref;
            }
          }}
          className="gif"
          width="800"
          playsInline
          autoPlay
          muted
          loop
        >
          <source src={this.state.gif_url} type="video/mp4" />
        </video>
      )
    } else if (
      this.state.gif_url.substr(-4) === '.gif'
      || this.state.gif_url.substr(-4) === '.png'
      || this.state.gif_url.substr(-4) === '.jpg'
    ) {
      return (
        <img
          ref={ref => {
            if (ref) {
              this.gif = ref;
            }
          }}
          className="gif"
          width={800}
          src={this.state.gif_url}
        />
      )
    } else {
      return (
        <div
          ref={ref => {
            if (ref) {
              this.gif = ref;
            }
          }}
          className="gif"
          style={{display: 'table', height: '400px'}}
        >
          <div
            style={{display: 'table-cell', verticalAlign: 'middle'}}
          >
            I'm so sorry, I can't render that filetype.
          </div>
        </div>
      )
    }
  }

  _renderPreview() {
    return (
      <div className="preview">
        {this._renderContent(this.state.gif_url)}
        <canvas
          ref={ref => {
            if (ref) {
              this.canvas = ref;
              this.ctx = ref.getContext('2d');
            }
          }}
          width={this.state.width}
          height={this.getHeight()}
        />
      </div>
    );
  }

  render() {
    if (this.state.read_only) {
      return (
        <div className="readonlycontainer">
          <div className="readonly">
            {this._renderPreview()}
          </div>
        </div>
      );
    }

    const {
      title,
      caption,
      tagline,
      gif_url,
      gif_height_adjust,
      signoff,      
      accentColor,
      captionBoxColor,
    } = this.state;
    const save_data = {
      title,
      caption,
      tagline,
      gif_url,
      gif_height_adjust,
      signoff,
      accentColor,
      captionBoxColor,
    };
    const save_link = Buffer.from(JSON.stringify(save_data)).toString("base64");

    return (
      <div className="main">
        <div className="content">
          <div className="topbar">
            <div className="logobox">
              <img src={logo} className="logo" alt="logo" />
            </div>
            <div className="title">
              X-Change Editor
            </div>
          </div>
          <div className="input">
            <span>
              url
            </span>
            <input
              onChange={event => this.setState({gif_url: event.target.value})}
              value={this.state.gif_url}
              style={{
                width: '400px',
              }}
            />
          </div>
          {
            this.state.show_advanced ? (
              <>
                <div className="input">
                  <span>
                    prettify?
                  </span>
                  <input
                    onChange={event => this.setState(prevState => ({render_as_raw: !prevState.render_as_raw}))}
                    name="isGoing"
                    type="checkbox"
                    checked={!this.state.render_as_raw}
                    style={{
                      width: '100px',
                    }}
                  />
                </div>
                <div className="input">
                  <span>
                    height adjust
                  </span>
                  <input
                    onChange={event => this.setState({gif_height_adjust: event.target.value})}
                    value={this.state.gif_height_adjust}
                    style={{
                      width: '100px',
                    }}
                  />
                </div>
                <div className="input">
                  <span>
                    pill
                  </span>
                  <input
                    onChange={event => this.setState({title: event.target.value})}
                    value={this.state.title}
                  />
                </div>
                <div className="input">
                  <span>
                    tagline
                  </span>
                  <input
                    onChange={event => this.setState({tagline: event.target.value})}
                    value={this.state.tagline}
                  />
                </div>
                <div className="input">
                  <span>
                    accent color
                  </span>
                  <input
                    onChange={event => this.setState({accentColor: event.target.value})}
                    value={this.state.accentColor}
                    >
                  </input>
                </div>
                <div className="input">
                  <span>
                    caption box color
                  </span>
                  <input
                    onChange={event => this.setState({captionBoxColor: event.target.value})}
                    value={this.state.captionBoxColor}
                    >
                  </input>
                </div>
              </>
            ) : (
              <button
                onClick={() => this.setState({show_advanced: true})}
              >
                advanced
              </button>
            )
          }
          <textarea
            ref={ref => {
              if (ref) {
                this.textArea = ref;
              }
            }}
            onChange={event => this.setState({caption: event.target.value})}
            value={this.state.caption}
          />
          <div className="input">
            <span>
              signoff
            </span>
            <input
              onChange={event => this.setState({signoff: event.target.value})}
              value={this.state.signoff}
            />
          </div> 
          <div className="selectorbar">
            <button className="selectorbutton pink" onClick={() => this.switchVariant("pink")}></button>
            <button className="selectorbutton blue" onClick={() => this.switchVariant("blue")}></button>
            <button className="selectorbutton purple" onClick={() => this.switchVariant("purple")}></button>
          </div>         
          <div className="previewbar">
            <a href="https://github.com/hahaluckyme/xchange#how-to-make-a-caption">instructions</a>
            <a href={`./?data=${save_link}`}>save</a>
            <a href={`./?read_only=true&data=${save_link}`}>preview</a>
            <a id="link"></a>
            <input type="text" id="clipboard" />
            <button
              onClick={() => {
                const filename = this.state.signoff
                  .split(',')[0]
                  .replace(/[^a-zA-Z0-9_ ]/g, '')
                  .substr(0, 15);
                const link = document.getElementById('link');
                link.setAttribute('download', `${filename}.png`);
                link.setAttribute(
                  'href',
                  this.canvas
                    .toDataURL("image/png")
                    .replace("image/png", "image/octet-stream"),
                );

                link.click();

                const pieces = this.state.gif_url.split('.');
                const extension = pieces[pieces.length-1];

                const input = document.getElementById("clipboard");
                input.value = `
                  ffmpeg
                    -i "${filename}.png"
                    -i "${this.state.gif_url}"
                    -filter_complex
                      "[1]scale=800:-1[a];
                      [0][a]overlay[b];
                      [b][0]overlay"
                    "${filename}.${extension}"
                `.split('\n').map(e => e.trim()).join(' ').trim();
                input.select();
                document.execCommand("copy");
              }}
            >
              download and copy ffmpeg command
            </button>
          </div>
          {this._renderPreview()}
        </div>
      </div>
    );
  }
}

export default App;
