# Tank Shelf API 
Tank Shelf is meant to be a friendly social media platform for tank enthusiests. It is meant to be a learning experience for developers and is just for fun! 
Bring your formicariums, your fish tanks, or your terrariums and lets vibe out. :fish: 

## The Stack
[MySQL](https://www.mysql.com/) - Database

[React](https://reactjs.org/) - API 

A react frontend can be found [here.](https://github.com/joeBwanKenobi/tankshelf-frontend)

## Getting Started

To get started there must be a MySQL database up and running with a specific database schema.

Then create a .env file in this top level directory with the following configuration values defined. This is only an example and the values will
be dependent on your local environment:

	PORT=30 					-- Port the API will be served from
	GOOG_CLIENT_ID=someID				-- Google credentials used for OAth
	GOOG_CLIENT_SECRET=someSecret
	PASSPORT_SESSION_SECRET=ANYSTRING		-- Used for session encryption
	SQL_HOST=databaseHostname			-- MySQL dtabase credentials
	SQL_USER=databaseuser
	SQL_PASSWORD=somePassword
	SQL_PORT=SQL_Port
	DATABASE=tankshelf
	FRONT_END_BASE_URL=http://localhost:3000/	-- Used for CORS headers if you are using a frontend.
	IMG_DIRECTORY=/media/tankshelf/uploads		-- Directory on local machine where images will be stored.

Make sure that the IMG_DIRECTORY that is configured exists on the local machine. This is where images will be stored for the application.

To install the required node packages run:
	npm install

Then to start the application run:
	npm run dev

## Contributing
To contribute, please fork this repository and work of a feature branch within your fork, for example from your fork's master:

    git branch -b new_feature_branch

While working on your feature branch, periodically bring your project up to date with a rebase:

    git rebase -i master

Once satisfied with your code, initiate a Pull Request (PR) from your feature branch against master. Once the PR gets any +1 approval it can be merged! Please squash your commits to one commit per PR with a meaningful commit message.
