Zendesk Search
==============
Sam and friends have been hoping for a way to get search working with
zendesk, and this is a project where we're trying to make that happen!

Files
=====
There's a wrapper designed to communicate with whatever search backend we
use kept in `zendesk-search.js`. It happens to work with elasticsearch, and
knows how to:

- Create an index and schema
- Add approved tags
- Remove approved tags
- Rename tags
- Find approved tags

Building
========
There's a `Makefile` included in this source that will build up the `.zip` file
that we can upload. It builds everything in the `src` and then bundles up
`assets` and everything:

```bash
# After this, `zendesk-search.zip` will exist
make zip
```
