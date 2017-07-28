---
layout: post
title: Writing a HTTP API Client in Elixir for the Noun Project
date: 2017-07-13 9:00:00
disqus: y
---

Doing some HTTP requests is usually one of the first things I do when
I'm learning a new language (apart from comparing its performance in
highly artificial benchmarks and checking whether it scales).

Of all the "up-and-coming languages with great concurrency" Elixir is
one of the most promising. While the community is awesome, the library
ecosystem is still, um, growing. As an alchemist with slightly
uncommon use cases one has to rise to the challenge of concocting ones
own little libraries.

Today, let's write a HTTP client for
the [Noun Project][noun_project]. There already are wrappers available
for [Node.js][noun_project_nodejs], [PHP][noun_project_php]
and [Ruby][noun_project_ruby] - but not Elixir (yet!).

I'll guide you through the process of writing an Elixir library by
trying out, exploring and refactoring. If you're an intermediate or
beginning Elixir Alchemist, this is for you.

If you're just interested in the library itself (I advise against
shortcuts, young alchemist!)
the [noun_projex code][noun_projex_github] is up
on [GitHub][noun_projex_github] you can find
the [published package][noun_projex_hex_pm]
on [Hex.pm][noun_projex_hex_pm].

## Getting started

Head over to the [Noun Project][noun_project], register an account and
create an API project on
their [developer's page][noun_project_developers]. The free
"Playground" pricing tier should be more than enough for our purposes
as we only need it for testing our client.

### Setting up the project

Let's start a new project with mix:

``` shell
mix new noun_projex
cd noun_projex
```

### Getting dependencies

Next, we need libraries for HTTP requests and JSON parsing. The upside
of Elixir's small ecosystem is that you hardly lose time contemplating
which library to use as there almost always is one clear choice. We
shall choose [HTTPoison][httpoison_hex] for the former
and [Poison][poison_hex] for the latter. Further, we will
need [oauther][oauther_hex] for some serious OAuthing Voodoo.

Let's edit our `deps` function in `mix.exs` and insert those
aforementioned dependencies:

``` elixir
defp deps do
  [{:httpoison, "~> 0.12"},
   {:poison, "~> 3.1"},
   {:oauther, "~> 1.1"}]
end
```

Note that after Elixir 1.4 we no longer need to add HTTPoison to our
`applications` function as it is automatically inferred (see
the [Elixir 1.4 release announcement][elixir_1_4_blog], section
"Application inference").

Finally, fetch the dependencies in your shell:

``` shell
mix deps.get
```

We're ready for some serious HTTP API Client coding!

## Accessing Endpoints

For every new project I code, I like to just whip up the _naive
approach_ first, in the way of "how would I do it if I wouldn't have
to consider architecture, best practices, security, code style, error
handling and what people think of me?". In my experience, this is a
great way of combating "coder's block" - sitting in front one's
keyboard and not coding anything because you've got "analysis
paralysis", turning things over in your head without coming to any
sort of conclusion.

It's also a great way to write really ugly code.

### Naive approach

Let's take a quick look at the [API docs][noun_project_api_docs]. How
about trying to query that first endpoint `GET /collection/(int:id)`?

Quick note: The way we write functions shall be `function_name/arity`
where arity means the number of arguments the function takes. It's the
Erlang / Elixir way of writing things.

Having briefly looked at
the [HTTPoison GitHub Readme][httpoison_github], our `get_collection/1` should
look something like this in `lib/noun_projex.ex`. Add some
documentation for good measure:

``` elixir
defmodule NounProjex do
  # Documentation in Elixir may include Markdown
  @moduledoc """
  [Noun Project](https://thenounproject.com) API Client in Elixir.
  """

  @doc """
  Returns a single collection by id (int).
  """
  def get_collection(id) do
    # We're using string interpolation here.
    # #{id} means it inserts the value of id
    url = "http://api.thenounproject.com/collection/#{id}"
    response =
      HTTPoison.get!(url)
    Poison.decode!(response.body)
  end
end
```

So what's the idea here? We construct our request URL by passing in
the id parameter as seen in the API documentation, make a HTTP GET
request and parse the resulting JSON response with Poison.

And... it fails with a HTTP 400 Bad Request error. Our approach was
very naive indeed. Of course we have to use our Noun Project API
credentials somehow.

### OAuth 1 Voodoo

Now, the Noun Project uses OAuth 1.0a which is rather old and there's
all sorts of Voodoo going on there. I lost quite some time trying to
get this part working so I'll only briefly outline the plot and give
you the solution to save you precious time:

1. Search for an Elixir OAuth 1 library.
2. Try to understand it just enough to make it work.
3. Hack around in IEx. Doesn't work.
4. Read up on the OAuth 1 spec and don't understand anything.
5. Go back to 2. about 25 times.
6. It works. Done.

This is how our naive `get_collection/1` should look now with some
Voodoo sprinkled in:

``` elixir
def get_collection(id) do
  consumer_key = "YOUR_CONSUMER_KEY"
  consumer_secret = "YOUR_CONSUMER_SECRET"
  method = "get"

  url = "http://api.thenounproject.com/collection/#{id}"

  credentials = OAuther.credentials(consumer_key: consumer_key,
                                    consumer_secret: consumer_secret)
  params = OAuther.sign(method, url, [], credentials)

  # we deconstruct the output here and don't care about the
  # request params
  {header, _req_params} = OAuther.header(params)

  # HTTPoison expect a lists of headers as second argument.
  # We only have one, therefore we pass a list
  # with header as only item
  response = HTTPoison.get!(url, [header])
  Poison.decode!(response.body)
end
```

Alright! We should be getting some sort of a reply with HTTP status
200 now. How about we look at the next Noun Project API endpoint and
continue?

Nope. The naive coding approach is good in the way that it gets us
going quickly but we should look out for opportunities for refactoring
(and not procrastinate). Here, our `get_collection/1` function is
suboptimal because it actually has two tasks: Requesting the API auth
header and calling the API endpoint. Also, we would have to copy-paste
those code blocks every time we would write a function for another API
endpoint.

To keep our own sanity, it's probably best to split those up into
separate functions. How about we extract the procedure of requesting
auth header first?

### OAuth 1 Voodoo refactored

``` elixir
defmodule NounProjex do
  @consumer_key = "YOUR_CONSUMER_KEY"
  @consumer_secret = "YOUR_CONSUMER_SECRET"

  # ...

  @doc """
  Construct OAuth 1 header with some serious Voodoo involved.
  """
  defp construct_oauth_header(method, url) do
    credentials = OAuther.credentials(
                    consumer_key: @consumer_key,
                    consumer_secret: @consumer_secret)
    params = OAuther.sign(method, url, [], credentials)
    {header, _req_params} = OAuther.header(params)
    header
  end
end
```

In case you haven't noticed yet, the OAuth 1 auth request procedure
actually depends on the exact URL (with parameters) you request. Just
thought I'd mention that as it cost me two hours of clueless debugging.

We also extract our `consumer_key` and `consumer_secret` and set them
as [module attributes][elixir_module_attributes] at the top of our
module. Later on, we will follow best practices and put them in a more
appropriate place but for now this is good enough.

The content of the `construct_oauth_header/2` function is pretty much
identical to what we saw before. We only return the `header` as we're
not interested in the rest.

However, another less obvious opportunity for refactoring can be seen
now: The pattern of function calls in our function is quite linear -
we're always calling one function, then passing on that result to the
next function and so on. It might be worth a try to refactor that into
a [with statement][elixir_with_statement], right?

### OAuth 1 Voodoo refactored into with statement

``` elixir
defp construct_oauth_header(method, url) do
  # credentials have been renamed to creds
  with creds <- OAuther.credentials(
                  consumer_key: @consumer_key,
                  consumer_secret: @consumer_secret),
       params <- OAuther.sign(method, url, [], creds),
       {header, _req_params} <- OAuther.header(params),
    do: header
end
```

Ah. Nice and sweet. We're basically doing the same stuff as before but
this time our code looks more concise and we could later on add an
`else` block to our `with` statement to handle all function
errors in one place.

Our `get_collection/1` now becomes:

``` elixir
def get_collection(id) do
  url = "http://api.thenounproject.com/collection/#{id}"
  header = construct_oauth_header("get", url)
  HTTPoison.get!(url, [header])
end
```

Looks good so far. In Elixir, functions ending with a bang `!` usually
throw exceptions when an error occurs. We would have to catch those
when they happen - however, that's not the Elixir way of doing things.

### Better error handling

We rather use HTTPoison's `get` function without a bang instead and
handle some errors via a `case` statement:

``` elixir
def get_collection(id) when is_integer(id) do
  url = "http://api.thenounproject.com/collection/#{id}"
  header = construct_oauth_header("get", url)

  case HTTPoison.get(url, headers) do
    {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
      # HTTP status 200 (OK) and we have a body
      case Poison.decode(body) do
        {:ok, decoded} -> {:ok, decoded}
        {:error, error} -> {:error, error}
      end
    {:ok, %HTTPoison.Response{status_code: status_code}} ->
      # any other HTTP status code
      {:error, status_code}
    {:error, error} ->
      # some error while making request
      {:error, error}
  end
end
```

Notice how I added the [guard][elixir_guards] `is_integer/1`? As we're
expecting `id` to only be an integer, we might as well enforce this.

We also change the return signature of our function to a tuple of
`{status, payload}` so a caller of our function could do similar error
handling. In this example, we react to all non-200 HTTP status codes
the same way but of course we could pattern match any HTTP code
specifically to react to erroneous responses in a more fine-grained
manner.

The rest is just pattern matching on HTTPoison's and Poison's return
values. Remember, Poison was the JSON decoding library and when we get
a good (status 200) response, we attempt to decode the body from JSON
to an Elixir map.

Great! Now, onto the next API endpoint.

Um, not so fast. When coding up the function for the next endpoint, we
would have to copy-paste that whole `case HTTPoison.get(url, headers)`
block all over again, right?

### Extracting HTTP requests

Another nice opportunity for refactoring. Let's extract the HTTP
request part into a private function:

``` elixir
defp do_request(url, headers) do
  case HTTPoison.get(url, headers) do
    {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
      case Poison.decode(body) do
        {:ok, decoded} -> {:ok, decoded}
        {:error, error} -> {:error, error}
      end
    {:ok, %HTTPoison.Response{status_code: status_code}} ->
      {:error, status_code}
    {:error, error} ->
      {:error, error}
  end
end
```

That's just copy-paste. Should be fine for now. Let's have a look at our updated `get_collection/1`:

``` elixir
def get_collection(id) when is_integer(id) do
  url = "http://api.thenounproject.com/collection/#{id}"
  header = construct_oauth_header("get", url)

  do_request(url, [header])
end
```

Nice and concise. Onwards to the next API endpoint! Looking at
the [Noun Project API docs][noun_project_api_docs] again, that would
be `GET /collection/(int: id)/icons`. Let's skip that for the moment
and go on to the next (third) one, which is `GET /collection/(slug)`.

Ugh! Your inner API designer moans. It's the same endpoint which we
already have coded but this time it accepts a different type of input
(`slug` is a string, instead of `id` which was an integer
earlier). Luckily, Elixir's [guard][elixir_guards] has our back here
(subtle pun intended).

### Same Endpoints, different type

We just copy-paste our prior function but change the guard (and
docstring, of course):

``` elixir
@doc """
Returns a single collection by slug (string).
"""
def get_collection(slug) when is_binary(slug) do
  url = "http://api.thenounproject.com/collection/#{slug}"
  header = construct_oauth_header("get", url)

  do_request(url, [header])
end
```

Note that we use the guard `is_binary/1` here as strings are binaries
in Elixir. The rest remains the same.

### Endpoint with parameters

Onwards to the endpoint we skipped just now (the second): `GET
/collection/(int: id)/icons`.

Let's code it:

``` elixir
@doc """
Returns a list of icons associated with a collection by id (int).
"""
def get_collection_icons(id, limit, offset, page)
      when is_integer(id) do
      # another guard

  base_url = "http://api.thenounproject.com/collection/#{id}/icons"
  params = [limit: limit,  # 1.
            offset: offset,
            page:page]
  query = URI.encode_query(params)  # 2.
  url = base_url <> "/?" <> query  # 3.
  header = construct_oauth_header("get", url)

  do_request(url, [header])
end
```

Now we have a bit of a new situation as we have to somehow pass
additional query parameters to the url. This is what's going on here:

1. First, assign `params` to be a keyword list of our parameters.
2. Then, encode that into a URI query e.g. `limit=123&offset=3&page=4`
3. Concatenate that with the `base_url` and don't forget a slash and
   question mark in between making our URL look like
   `http://api.foo.com/?limit=123&offset=3&page=4`

Don't forget that you have to pass the URL which includes the
parameters to your OAuth function as those parameters are of course
part of the URL - no use passing the `base_url` to the OAuth function!
I hope I saved you another hour of debugging obscure auth bugs there,
I certainly spent that time debugging...

Now, this works but it becomes noticeable that we are still repeating
ourselves. We always have to specify the `url` which we are requesting
and manually interpolate the request parameters into it. Now that we
have explored the API endpoints further and know that we sometimes
also have to add request parameters we might as well incorporate all
of that into a private function.

### Extracting URL construction

First, some thoughts. How about a function call signature like this:

``` elixir
iex(1)> construct_url("collections")
"http://api.thenounproject.com/collections"

iex(2)> id = 123
123

iex(3)> construct_url(["collection", id])
"http://api.thenounproject.com/collection/123"

iex(4)> params = [limit: 50, offset: 10, page: 3]
[limit: 50, offset: 10, page: 3]

iex(5)> construct_url(["collection", id, "icons"], params)
"http://api.thenounproject.com/collection/123/
 icons/?limit=50&offset=10&page=3"
```

Looks okay? To implement that, we have to handle three input cases:

1. One parameter of type string
2. One parameter of type list
3. Two parameters of type list

Elixir's pattern matching really shines here:

``` elixir
defmodule NounProjex do
  @base_url "http://api.thenounproject.com"

  # ...

  defp construct_url(dir) when is_binary(dir) do
    @base_url <> "/" <> dir
  end
  defp construct_url(dirs) when is_list(dirs) do
    @base_url <> "/" <> Enum.join(dirs, "/")
  end
  defp construct_url(dirs, params) do
    # notice the awesomeness!
    construct_url(dirs) <> "/?" <> URI.encode_query(params)
  end
end
```

What sort of wizardry have we done? For one parameter, it's simple:

- If it's a string, simply concatenate it to `@base_url`
- If it's a list, join the list's contents with a slash and
  concatenate that to `@base_url`

By the way, we extracted the `base_url` to be a module attribute.

Our `construct_url/2` is even more interesting: It calls
`construct_url/1` with the first parameter `dirs` and just adds the
encoded URI parameters to the end of the string. That means that we
can actually call it by passing either a string or a list to `dirs` as
both are handled appropriately by delegating to the one-parameter
function `construct_url/1`!

Of course we could have handled this task with an external library but
where's the fun in that?

Our updated `get_collection_icons/4` now looks like this:

``` elixir
def get_collection_icons(id, limit, offset, page)
      when is_integer(id) do

  params = [limit: limit,
            offset: offset,
            page: page]

  url = construct_url(["collection", id, "icons"], params)
  header = construct_oauth_header("get", url)

  do_request(url, [header])
end
```

It looks yet cleaner again!

By the way, the API docs state that when no `limit` is provided,
`limit` is assumed to be 50. And if `page` is provided, `offset` is
ignored. So that's tricky with our function parameter order: If we
only want to pass in a value for `page`, what do we do with `offset`?
Pass `0`? That doesn't seem very clean.

Wouldn't it be better if we were to filter the parameters beforehand
so that only "allowed" parameters could be passed? This would also
allow us to describe our API query parameters as data, namely, as a
list.

### Parameter filtering

Our new `get_collection_icons/2` should look something like this. We
circumvent the problem of "parameter ordering" by passing all
parameters as one variable `params` (a keyword list) and filtering
them appropriately with `filter_params/2` which we still have to write:

``` elixir
def get_collection_icons(id, params)
      when is_integer(id) do

  params = filter_params(params,
             [:limit, :offset, :page])

  url = construct_url(["collection", id, "icons"], params)
  header = construct_oauth_header("get", url)

  do_request(url, [header])
end
```

Looks better yet. We are basically describing which query parameters
are allowed and discarding those which aren't. The implementation of
`filter_params/2` is trivial:

``` elixir
defp filter_params(params, allowed_params) do
  Enum.filter(params, fn {key, _value} ->
    key in allowed_params
  )
end
```

By deconstructing each entry of `params` to `{key, _value}` we can
iterate only over the keys and ignore the values for now. The
expression `key in allowed_params` returns true if the our current
parameter key is allowed and false otherwise. Using that in
`Enum.filter/2` lets us simply discard all non-allowed params with
their values. Nice!

There's actually a built-in abstraction for that: `Keyword.take/2`. So
we could go on and yet further simplify our implementation:

``` elixir
defp filter_params(params, allowed_params) do
  Keyword.take(params, allowed_params)
end
```

We could also call `Keyword.take/2` directly instead of calling it via
`filter_params/2` - that's a matter of style and personal preference,
I guess. You decide!

### Packing more into do_request

Now there still are some low-hanging fruit. We still are repeatedly
calling `construct_url` and `construct_oauth_header/2` in every API
request function. I suggest we integrate those into `do_request` as we
will have to construct the url and auth headers for every request
anyway. Due to `construct_oauth_header/2` having to know the request
method (GET / POST), we will have to pass it to `do_request`.

From the other side, it should look something like this:

``` elixir
iex(1)> do_request(:get, ["collection", 5],
                    limit: 20, offset: 10)
```

Note that Elixir passes the last two arguments (`limit: 20` and
`offset: 10`) actually as one parameter (a keyword list) to the
function. If they weren't the last parameters (e.g., somewhere in the
middle) or we would want to write it in a more verbose manner, we
could write:

``` elixir
iex(1)> do_request(:get, ["collection", 5],
                    [limit: 20, offset: 10])
```

Or even more verbose, using the internal representation of keyword
lists:

``` elixir
iex(1)> do_request(:get, ["collection", 5],
                    [{:limit, 20}, {:offset, 10}])
```

Good to know. I didn't understand this myself for quite some
time. Anyway, let's not get distracted and commence the implementation
of `do_request/3`:

``` elixir

def do_request(method, path, params) do
  # note the new variable `method` in the function
  # we are passing `path` instead of `url`
  # we are not passing `headers` anymore
  # `params` is another new variable

  url = construct_url(path, params)

  # note the to_string(method) call below
  headers = [construct_oauth_header(to_string(method), url)]

  case HTTPoison.get(url, headers) do
    # the same as in the last iteration
    # omitted for brevity
  end
end
```

Looking good! I decided that passing the request method as an atom
(`:get` instead of `"get"`) looks cleaner - but I'll let you
decide. Anyway, now we have to convert it to a string for the OAuth
Voodoo library as seen above.

We also construct the headers. Then we execute the request as seen
before already.

### Implementing the updated functions

Going back to our last API endpoint it should now look like this:

``` elixir
def get_collection_icons(id, params)
      when is_integer(id) do

  params = filter_params(params,
             [:limit, :offset, :page])
  path = ["collection", id, "icons"]

  do_request(:get, path, params)
end
```

Awesome! How much cleaner can it get?

What about our API endpoints which don't take any query parameters?
How about creating `do_request/2` which doesn't take any `params` but
delegates the call to `do_request/3` with an empty list for `params`?
Sounds tricky but actually it's a one-liner:

``` elixir
def do_request(method, path) do
  do_request(method, path, [])
end
```

We simply delegate the call to `do_request/3` with an empty list as `params`.

Let's take a look how the two other endpoints which we implemented
earlier look now in their final iteration:

``` elixir
def get_collection(id) when is_integer(id) do
  do_request(:get, ["collection", id])
end

def get_collection(slug) when is_binary(slug) do
  do_request(:get, ["collection", slug])
end
```

Your Inner Functional Programming Aficionado (IFPA) should be overjoyed.

### Metaprogramming

Can we go any further? Yes! Having to write a new function for every
API endpoint seems like a repetitive thing to do. We could describe
all API endpoints as one big data structure and create the function at
compile time with macros.

I must confess that I stopped there. My library was already more than
_good enough_ (and clean enough!) and I do tend to get lost
over-engineering stuff so I have to stop optimizing at some stage.

I could however imagine the data structure to look somewhat like this:

``` elixir
api_endpoints = [
  {:get_collection, ["collection", :id], [id: :int], []},
  {:get_collection, ["collection", :id], [id: :string], []},
  {:get_collection_icons,
    ["collection", :id, "icons"],
    [id: :int],
    [:limit, :offset, :page]}
]
```

So you would have to describe each API endpoint as data. Each tuple consists of:

``` elixir
{function_name, path, param_types, query_params}
```

And then your macro would have to read each tuple and create a
function accordingly. Well, that's at least how I would approach it
(in its first iteration...). It does sound kind of over-engineered but
very fun.

If you're further interested in Elixir's macros you should definitely
check out Chris McCord's
book [Metaprogramming Elixir][metaprogramming_elixir] after which
implementing the above while creating a flying saucer and a perpetuum
mobile should be no problem for you.

## Further improvements

What else is there to do? Earlier, we procrastinated saving our API
keys in a safe way (you remember that, right?) so we should take care
of that now. Here is how it looks currently:

``` elixir
defmodule NounProjex do
  @consumer_key = "YOUR_CONSUMER_KEY"
  @consumer_secret = "YOUR_CONSUMER_SECRET"

  # ...
end
```

This is probably not a good idea. Why?

1. When you commit it to version control (e.g. git), your keys are
   baked in even if you delete the file later on. It will be tedious
   to delete that specific file later and modify your version control
   history (if you remember to do that at all).
2. As soon as the library leaves your computer (e.g. when publishing
   to GitHub, sending it to a colleague, deploying to server) your API
   keys will most likely be seen by a third party.

How do we mitigate this issue? In
the [Phoenix Framework][phoenix_framework] this problem is quite
elegantly solved in config files with the suffix `.secret`,
e.g. `prod.secret.exs` in the `config` directory of your project.

That sounds like a great idea. Let's steal it.

### Setting up the config

Create the file `dev.secret.exs` in the `config` directory:

``` elixir
use Mix.Config

config :noun_projex,
  api_key: "YOUR_CONSUMER_KEY",
  api_secret: "YOUR_CONSUMER_SECRET"
```

We then have to make sure it gets loaded, of course only in `dev` and
`test` for now. Open up `config.exs`, also in the `config` directory
and key this in:

``` elixir
use Mix.Config

dev_secret_path = Path.expand("config/dev.secret.exs")

if Mix.env in [:dev, :test] do
  if File.exists?(dev_secret_path) do
    import_config "dev.secret.exs"
  end
end
```

So we only import our `dev.secret.exs` file if it exists. We could
omit the `File.exists?` check but then our application would crash
when the file is missing.

We of course have to modify our module attributes in
`lib/noun_projex.ex` accordingly:

``` elixir
defmodule NounProjex do
  @consumer_key Application.get_env(:noun_projex, :api_key)
  @consumer_secret Application.get_env(:noun_projex, :api_secret)

  # ...
end
```

There's not much to explain here - `Application.get_env` is simply a
way to read variables which you have configured in your `config`
directory.

We are done, right? Nope. Notice what's missing?

We still have to add `dev.secret.exs` to the `.gitignore` in the root
project directory otherwise our whole effort would have been futile:

``` text
# The directory Mix will write compiled artifacts to.
/_build

# ...
# lots more auto-generated stuff from mix
# ...

# API keys
config/dev.secret.exs  # <-- this is new
```

Woopah! Nice and safe. Now you can `git commit` safely and your API keys
steer clear of your version control history.

What else could there possibly be to do?

### Testing

If we had been following "Test-driven development" (TDD, not Tower
Defense Defense as I would have read it a year ago) we would have
written our tests before we had written our library.

While TDD can be a good tool to have, personally, when I'm not
entirely sure how my functions (or API) are going to look like, I tend
to use the "naive approach" and write my code in an exploratory way
first. In those situations, TDD tends to get in my way. It's like when
someone is sitting behind you and constantly asking you "what are you
doing? what are you doing?" and you have no clue but have to reply
somehow. Very annoying.

That's not to say that we don't need tests! Now that our API is
stable, we should write some. Let's open up `tests/noun_projex_test.exs`:

``` elixir
defmodule NounProjexTest do
  # set async to true as our tests don't depend
  # on each other, saving us time
  use ExUnit.Case, async: true

  # test our documentation, at the moment there's
  # nothing to test there (yet!)
  doctest NounProjex

  # Our tests will go here
end
```

This is how it should look like for starters. Let's write tests for
the three API endpoints we coded functions for:

``` elixir
# Set some fixtures as module attributes
# Fixtures are basically "testing constants"
@collection_id 26590
@collection_slug "bike"
@params [limit: 20, offset: 0]

test "get collection by id" do
  assert {:ok, _result} = NounProjex.get_collection(@collection_id)
end

test "get collection by slug" do
  assert {:ok, _result} = NounProjex.get_collection(@collection_slug)
end

test "get collection icons by id" do
  assert {:ok, _result} =
    NounProjex.get_collection_icons(@collection_id, @params)
end
```

Run `mix test` in your shell and you should see three unremarkable
green dots (I do hope so).

Our test suite is very minimalistic. We are only expecting an `{:ok,
_result}` tuple which means that any test will pass as long as the
HTTP response code is 200. Of course this isn't very thorough and you
should set up some more detailed fixtures. For example, you could call
the API with our test parameters, note down the return values and save
those as an expected result. This is of course assuming that the Noun
Project API always returns the same values over time.

But for now, it's good enough. Testing for HTTP 200 allows us to catch
authentification problems, wrongly constructed URLs, malformed
parameters and probably a few more things. Not that bad at all.

## Summary

Phew! What a journey! We went from naively hacking in `HTTPoison.get!`
requests to quite a polished API via approximately one thousand
refactorings. We added proper configuration support and some tests to
round things off.

For me, this was a great learning experience. I hope that I could save
you some time and you learnt a lot along the way, too!

The complete [noun_projex code][noun_projex_github] is up
on [GitHub][noun_projex_github]. It's also [published][noun_projex_hex_pm]
to [Hex.pm][noun_projex_hex_pm].

Thanks for corrections goes out to [@ggpasqualino], [@thorstendeinert]
and [@schaary].

[noun_project]: https://thenounproject.com
[noun_project_nodejs]: https://github.com/rosshettel/the-noun-project
[noun_project_php]: https://github.com/onassar/PHP-TheNounProject
[noun_project_ruby]: https://github.com/TailorBrands/noun-project-api
[noun_project_developers]: https://thenounproject.com/developers/apps/
[noun_project_api_docs]: http://api.thenounproject.com/documentation.html
[httpoison_hex]: https://hex.pm/packages/httpoison
[httpoison_github]: https://github.com/edgurgel/httpoison
[poison_hex]: https://hex.pm/packages/poison
[oauther_hex]: https://hex.pm/packages/oauther
[elixir_1_4_blog]: https://elixir-lang.org/blog/2017/01/05/elixir-v1-4-0-released/
[elixir_module_attributes]: https://elixir-lang.org/getting-started/module-attributes.html
[elixir_with_statement]: http://openmymind.net/Elixirs-With-Statement/
[elixir_guards]: https://hexdocs.pm/elixir/master/guards.html
[metaprogramming_elixir]: https://pragprog.com/book/cmelixir/metaprogramming-elixir
[phoenix_framework]: http://www.phoenixframework.org
[noun_projex_github]: https://github.com/olieidel/noun_projex
[noun_projex_hex_pm]: https://hex.pm/packages/noun_projex
[@ggpasqualino]: https://github.com/ggpasqualino
[@thorstendeinert]: https://disqus.com/by/thorstendeinert/
[@schaary]: https://github.com/schaary
