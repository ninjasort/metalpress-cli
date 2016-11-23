# metalpress-cli [![npm](https://img.shields.io/npm/v/metalpress-cli.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/metalpress-cli) [![Travis](https://img.shields.io/travis/axisdefined/metalpress-cli.svg?maxAge=2592000?style=flat-square)](https://travis-ci.org/axisdefined/metalpress-cli) [![Codecov branch](https://img.shields.io/codecov/c/github/axisdefined/metalpress-cli/themes.svg)](https://codecov.io/gh/axisdefined/metalpress-cli/branch/themes)

CLI for Metalpress (Official)

## Structure and Templating

metalpress works from a specific directory structure. It contains a `templates` and `src` directory. Within the src directory it will load data from `data` as `yaml` or `json` files. You can create folders for collections and use markdown files for pages. You should store all assets in `assets`.

For templating, metalpress uses liquid. You can learn more about the [syntax here](https://github.com/leizongmin/tinyliquid).

Here's an example structure:

```sh
├── package.json
├── src
│   ├── data
│       ├── site.yaml
│       ├── projects.json
│   ├── assets
│       ├── sass
│       ├── img
│       ├── fonts
│       ├── js
│           ├── index.js
│   ├── index.md
│   ├── pages
│       ├── about.md
│   └── posts
│       ├── 2016-08-25-how-to-use-metalpress.md
├── templates
│   ├── _includes
│       ├── header.liquid
│       ├── footer.liquid
│   └── _layouts
│       ├── home.liquid
```


### Installation

```sh
npm install metalpress-cli -g
```


### CLI Usage

#### Initialize a New Project

> Prompts a series of questions and creates a new `.metalpress` config.

```sh
metalpress init
```

#### Start a Browser-sync Server

> Serve the project on automatically assigned browser-sync port. (default: http://localhost:3000)

```
metalpress serve
```

#### Deploy a Project

To deploy your site, you'll need to have your `aws.json` set up. It includes:

```
{
  "key":"AWS_ACCESS_KEY_HERE",
  "secret":"AWS_SECRET_KEY_HERE",
  "stagingBucket":"staging.example.com",
  "productionBucket":"example.com"
}
```

> Deploy a `dist` and deployed to AWS S3.

*Staging*
```
metalpress deploy
```

*Production*
```
metalpress deploy -p
```
