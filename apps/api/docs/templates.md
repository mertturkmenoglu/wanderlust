# Templates

- We are using the `handlebars` package for templating.
- You can find the templates in `src/templates` folder.
- You can use variables in the template by using `{{VariableName}}` syntax.
- For sending emails, read the `email.md` file.

## Example

```html
<html lang="en">
  <head>
    <style>
      .brand {
        color: #18815e;
      }
    </style>
    <title>Wanderlust</title>
  </head>

  <body>
    <h1>Welcome to Wanderlust!</h1>
    <p>Hi {{name}}, welcome aboard! We are so happy to see you.</p>
    <p>Quick tips:</p>
    <ul>
      <li>Explore curated itineraries</li>
      <li>Create your first trip</li>
      <li>Invite friends</li>
    </ul>
    <p>Get started by exploring our features and planning your next adventure.</p>
    <p>The <strong class="brand">Wanderlust</strong> Team</p>
  </body>
</html>
```
