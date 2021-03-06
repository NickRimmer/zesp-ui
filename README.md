# About the tool

Hello, my friend! I hope you are doing good (=

A few words about the tool - currently this is an experimental application to provide just another client for awesome ZESP service (there is ZESP
developers [telegram channel](https://t.me/zesp32)).

# How to use

Built and ready to use application is available on [zesp.dipteam.com](http://zesp.dipteam.com/) (for the moment ZESP service doesn't allow you to use `https` scheme, so be sure you
are with `http`).

## Can I start it locally on my PC or my hub devices?

Definitely yes.

- Just download the already built application from [gh-page branch](https://github.com/NickRimmer/zesp-ui/tree/gh-pages) and open `index.html`
- If you want to play with source codes, to build it as a regular React application execute `npm run build` or `npm start` to start it locally for development.

## How to install Self-Hosted version

### Install

```
wget https://gist.github.com/NickRimmer/8163d849d5b88f435a87dc28de1313c9/raw/zesp-ui-self-hosted-install.sh -O ~/zesp-ui-install.sh
chmod a+x ~/zesp-ui-install.sh
~/zesp-ui-install.sh
rm -f ~/zesp-ui-install.sh
```

### Uninstall

```
wget https://gist.github.com/NickRimmer/8163d849d5b88f435a87dc28de1313c9/raw/uninstall.sh -O ~/zesp-ui-uninstall.sh
chmod a+x ~/zesp-ui-uninstall.sh
~/zesp-ui-uninstall.sh
rm -f ~/zesp-ui-uninstall.sh
```

or

```
/etc/init.d/zesp_ui stop
/etc/init.d/zesp_ui disable
rm -f /etc/init.d/zesp_ui
rm -fr /opt/zesp-ui
```

# Contributing

We love your input. This all is possible only because of you 🥳

- [General information](docs/contributing.md) about how to make changes.
- What if your device is unfairly unknown - [change it with templates](docs/templates.md) right now.
