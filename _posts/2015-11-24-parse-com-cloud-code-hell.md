---
layout: post
title: Parse.com Cloud Code Hell
date: 2015-11-24 23:00:00
disqus: y
---

I would really, really love to be able to like Cloud Code. The idea of
simplifying any backend into one unified platform with push-capabilities and
node.js-style extendability sounds awesome.

However, I ended up struggling. I am by no means a good programmer but
as long as an SDK is coherent in itself and well-documented, it's no problem.

This doesn't hold true for Parse.com Cloud Code. Its infuriating. If you think you can bang out some JS and hack together a nice backend in a few hours, forget about it. Look somewhere else. Welcome to **Cloud Code Hell**.

The Documentation looks neat and complete at first, but don't be fooled, it's not! Here's my collection of "Cloud Code Quirks" which are mostly undocumented. While I was spending my time in **Cloud Code Hell**, I found these bits on Stackexchange or the Parse Forums.

Please feel free to comment or submit a Pull Request.

# Cloud Code Quirks

## Developing

### Developing / IDE

It's seemingly impossible to adapt your IDE to Parse Cloud Code as the JS library resides on Parse.com's servers and is dynamically added to your Cloud Code. You may download the js library and adding it to your working directory manually for some Autocompletion (in Atom, for example), but it's incomplete. Say hello to frustrating typos which you will have to debug on the Cloud Log.

### Logging is incomplete

You may log to the console via `console.log()`. You can view the log on
Parse.com or in your own console if you are running `Parse develop project-name`. This may sound nice, but it's highly frustrating. If you log a Parse Object to the console, simply nothing is logged.

## Important stuff

### beforeSave and afterSave are always being called

Wondering why your methods are throwing some sort of "too many recursive function calls" error? Guess what, any time you modify an Object in your Parse DB, the associated `beforeSave` and `afterSave` methods are called, even if you execute the query with the master key. You may detect this, read on.

### Check if Query is being executed via Master Key

Sometimes you will have Background Jobs cleaning up the database and modifying objects. Under these circumstances, you might not want the associated `beforeSave` and `afterSave` methods being called. Guess what, there's another undocumented value which helps you out here. It's `request.master` (if you bind your request to the var request, obviously).

So for example, you might early abort a `beforeSave` function like so:

```javascript
if(request.master) {
  response.success();
}
```

### Getting an Objects ID

You can get the ID of an (existing) Parse Object by accessing `object.id`, so if your object resides in the `request` variable it becomes `request.object.id`. Note that `object.get('objectId')` will **not** work, even though it works on the Client SDKs. Argh!

## beforeSave / afterSave

### Which user is uploading?

You may get the current user via `object.user`. Don't try to log it to the console.

### Queries are executed as the User

If your queries are returning empty or incomplete data, you might not be using the Master Key and Parse will therefore be applying the ACL of the objects in question. Remember to set `Parse.Cloud.useMasterKey()` in the beginning of your Cloud Code Function if you want to execute queries with master privileges.

### Different behavior in `beforeSave`

Note that in your `beforeSave` functions, you don't have to call `object.save()` when you're done. Calling `object.set('key', 'value')` is sufficient to trigger a save when the function is done. Note that in all other Cloud Code Functions, you will have to call `object.save()` if you want to save your modifications to an object.

### Object exists already?

In `beforeSave` and `afterSave`, you might want to check if you are actually updating an existing object or creating a new one. Instead of wasting a query, you can use `object.isNew()` which returns a Boolean. Ready for some more confusion? This should be used in beforeSave, in afterSave, you should rather use `object.existed()` as noted by [Bryan Klimt in the Parse Forums](https://parse.com/questions/difference-between-existed-and-isnew):
>In a beforeSave handler, use isNew. isNew is a Backbone method originally designed for client code. All isNew does is check whether the object has an objectId. In a beforeSave handler, a new object will not have an id yet, so it will do what you want.
>
>In an afterSave handler, use existed. Immediately after the first time an object is saved, existed will return false to indicate that the last server operation created the object. If the object is subsequently saved again, the object will have already existed on the server, so existed will return true from then on.

### ParseFiles have to be uploaded prior to your Object

This is sort of documented, but not very clearly. In your Client, you have to upload your ParseFile first, then in the success callback, upload your ParseObject with a pointer to the (alredy uploaded) file. It may work if you ignore this, but it may throw random errors. Have fun debugging.

### Saving Pointers in `beforeSave`

It's not possible. So frustrating. This cost me like 4 hours. Apparently, fetching a Pointer and trying to modify it inside a `beforeSave` function triggers a save of the `beforeSave` object, not the Pointer object! Argh! That makes you end up calling your `beforeSave` function recursively. Lots of fun to debug this.

See this example. Say, we have uploaded a ParseFile to the Class "Images" and stored a Pointer to it in Stuff. Also, we would like to store a Pointer to the uploading user in Images and Stuff. And maybe a Pointer in Images pointing to the associated Stuff class, like so:

```javascript
// Just to explain the Structure.
// Client-Side
uploadImage = new Images();
uploadImage.set("file", new ParseFile(/* file */));

uploadObject = new Stuff();
// Store Pointer to Image
uploadObject.set("imagePointer", uploadImage);
```

Now, on the server side, we want to store a pointer in the Image back to the Stuff object.

```javascript
Parse.Cloud.beforeSave("Stuff", function(request, response) {
  // Fetch the Pointer data
  request.get("imagePointer").fetch()
    .then(function(result) {
      // Set a pointer in the Image class
      // back to the Stuff object.
      // This should make sense, right?
      result.set("stuffPointer", request.object);

      // Oh wait, it doesn't work.
      // Hm, do we have to call object.save() now,
      // even though we`re in beforeSave?
      result.save();

      // Forget it. This will throw a
      // "too many recursive function calls" error.
      // Welcome to Parse Cloud Code Hell.

    }, function(error) {
      response.error(error);
    });
});
```

So, what's happening here? I don't really know completely, to be honest. Apparently, calling `result.save()` doesn't save the Pointer Object (Class Images) as it should, but it tries to save the Stuff Object and therefore recursively calls the same `beforeSave` function, which is kind of senseless.

Note that anywhere else outside `beforeSave`, say, in a Background Job, it would work. Argh!

So, what's the solution? I found that simply doing this sort of stuff in an `afterSave` function instead does the trick. Oh, and while youre migrating your function to `afterSave`, don't forget that `afterSave` and `afterDelete` don't have a `response` object so don't even try to set a response. This might make debugging a little more difficult, by the way.

## Background Jobs / Functions

### Background Jobs can't be called

Don't even try. You can only call Background Jobs by scheduling them or by manually executing them from your Parse Webinterface.

### Fetching ParseFiles for processing

If you want to process a ParseFile in a Background Job, you will have to fetch it via http (and fetch its URL prior to that). See the example in [the documentation](https://parse.com/docs/cloudcode/guide#cloud-code-modules-parse-image).

### Fetching ParseFiles may time out

Ready for some more fun? Sometimes the request times out and your function gets killed prematurely (in normal Parse Functions, not in Background Jobs, which have less aggressive time limits). So say, if you have a Parse Function which generates some thumbnails in an `afterSave` function, it may happen that the http request to fetch the ParseFile may time out and your thumbnails don't get generated.

Get ready to write some Background Jobs which tidy up your database, looking for incomplete entries due to aborted functions.

## Modules

### The parse-image Module

Have fun. It's completely undocumented. Try looking at [this example in the documentation](https://parse.com/docs/cloudcode/guide#cloud-code-modules-parse-image).
