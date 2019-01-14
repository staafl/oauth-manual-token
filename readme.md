OAuth is the modern way for applications to authenticate their access to
user data in third party services, however the token retrieval workflow is
designed for browser usage and is difficult to perform in a desktop or
backend application. For development purposes, or ad hoc solutions it's
often useful for the developer (or user) to generate the token themselves
and provide it to their application themselves.

This simple application will receive the OAuth token callback from a
webservice and allow you to copy it for your application configuration. You
are strongly advised to consider the security implication of this approach
and model your development/deployment strategy accordingly.

Of course, you need to register the application in the third party service,
like any other OAuth client application.