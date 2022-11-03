# Setup

**Dev**
- `npm install` , Node version is LTS 10+ 
- `npm run start` to run webpack dev server with HMR etc... . You'll need a `.env` file start with copying the `.env.example` and editing to your own details. 
- `npm run start:server` to run development express server which will be serving from `dist` folder (can't help this one, proxying won't work while injecting assets) so you need to run `npm run build:production` at least once and then every time you need to update the static files, as this is for testing the express server .


**Production**

* `index.html` vs `index.prod.html` :  we have 2 production environments , s3 and a node server both handling different https setup restrictions we've had because of our whitelabeling . They are identical but `index.prod.html` is pulling directly from s3 assets and isn't included in the build process so they should **always be in sync**.

- Run `npm run build:production` to build production `dist` folder. You can run `npm run start:server` to serve dist folder if you need to test production build locally using the express server.

- Run `npm run deploy:production` to build and then deploy to s3 1st before any changes to node server get pushed, this is **IMPORTANT** , Node production doesn't have a build step, it just pulls new code from GH and that's it but relies on assets already being on s3

- On production, add a AWS__BUCKET_SECRET_KEY to the `.env` file , Node server needs this to correctly sign s3 upload urls . Please **NEVER** commit any such data into git .

*Notes:*

------

* You **need** to have the local node server running (`npm run start:server`) for you to be able to upload files , we use the node server api for some small things that didn't work or are hard to do in the php server like the s3 signature thing that didn't work for some reason . For now that's all you need express running **LOCALLY** for. 

* In components and javascript files if you need to import a global asset like `/img/icons/someIcon` you **HAVE** to use the util from `utils/getAsset` which prefixes with the bucket url for node production environment

* Make sure anything that gets added to env variables is also copied to `.env.example`

# Workflow & Git

- We use CD pipline and `master` branch is automatically deployed to the live production site at all times so Please **NEVER** push directly to master .
- The base branch is `dev` so work against that and pull requests are pulled against it as well .
- run this sequence every day before starting to keep things working right in case somebody else pushed something on your branch 
```
git stash
git pull
git stash pop
```
- Merge `dev` frequently into the branch you're working on so you can avoid nasty merge conflicts , so the above workflow becomes 
```
git stash
git fetch
git merge dev
git stash pop
```
- Any substantial feature needs a separate PR and prefereably a review , ask any available team member to take a look .


