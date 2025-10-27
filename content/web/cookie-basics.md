---
title: "Cookie Basics"
date: "2025-09-08"
tags: ["web"]
category: "web"
---

LifeSpan
  - Cookies can have a specific expiration date set using the `Expires` or `Max-Age` attribute.
  - If neither of the attributes are set, cookie expires on closing browser (Session Cookie)

Security
  - HttpOnly Cookie - Can't be accessed using JS
  - Secure Cookie - Only works on HTTPS


### Cookie Store API

  - Relatively new, check support on caniuse

```
cookieStore.set
cookieStore.get
cookieStore.getAll()
cookieStore.delete
```

