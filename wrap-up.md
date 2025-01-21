## Questions

### What issues, if any, did you find with the existing code?
- The UI requires that every response payload contain the account information.
- The UI does not show errors returned by the backend.
- There's no authorization implemented, so anyone can mimic any account.
- No transaction records implemented.
- Pretty sure alpha-numeric account ids are accepted by the backend.
- Is "docker run build" (referenced in README.md) a typo for "docker-compose build"?

### What issues, if any, did you find with the request to add functionality?
There were no transaction records, which made the implementation (a naive in-memory cache) of a daily withdrawal limit hacky and prone to issues.

The requests outlined in the README included upper limits, but no explicit lower limits. You can still deposit negative numbers and withdraw negative numbers.

### Would you modify the structure of this project if you were to start it over? If so, how?
Would have been nice for migration scripts to be implemented so that the databases could be altered during this assessment. The database seed provided did not seem like it was meant to be altered in order to achieve the desired app functionality.

Also in that vein, I prefer to use ORM libraries like sequelize in order to represent database models in code, rather than relying on the raw SQL queries and implicit types.

Personally when building REST APIs, I prefer when the routes are represented by the file system. Several open source libraries accomplish this.

Prettier + eslint are recommended for project formatting alignment.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
No

### If you were to continue building this out, what would you like to add next?
Authorization, migration scripts, ORM library to represent data model.

### If you have any other comments or info you'd like the reviewers to know, please add them below.