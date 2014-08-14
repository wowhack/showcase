# WOW Hack 2014 Showcase site

## Develop

```bash
npm install
GH_USER=USER GH_PASS=PASS HOST_NAME=HOSTNAME gulp server
```

Visit [localhost:3000](http://localhost:3000) in browser.

Gulp tasks:
```bash
gulp        # Defaults to gulp serve
gulp server # Start Express server on localhost:3000
gulp css    # Compile Scss to minified CSS
gulp watch  # Watch and compile Scss to CSS on change
gulp serve  # Runs server *and* watches Scss
```

We take PRs!
