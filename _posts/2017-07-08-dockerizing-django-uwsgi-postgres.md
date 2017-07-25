---
layout: post
title: Dockerizing Django, uWSGI and Postgres the serious way
date: 2017-07-10 12:00:00
disqus: y
---

So you want to get in on the hot new stuff and decided it's time to
learn Docker. Good on you! Docker is the new kid on the block which
allows you to containerize stuff. Well, not really - it's not that new
at all. I tend to miss these pieces of software which emerge from the
darkness of the interwebs, silently creeping around behind me until
they suddenly establish themselves as some sort of standard and
everybody except me uses them.

If you're similar to me in that respect: Worry not! Here's the good
news: By now, you can google all error messages and get away without
learning it at all.

But that's not what we're here for. We want to containerize
things. Why do we want to containerize things? Because containerized
things scale. Why do we want to scale? What an unnecessary question!
We always must be ready to scale. When our Todo App hits the Hacker
News front page, we should count ourselves lucky if we can simply whip
up another 50 instances to handle the load of eager hackers with lots
of things to do.

Also, python packaging can be messy at times and as we're learning
Docker right now, all our problems suddenly are to be solved with a
~~hammer~~ container, right? No need for virtualenvs, we simply shove
everything into containers!

---

## Dockerizing Django

Let's dockerize a serious Django application. We shall use uWSGI
because it's harder to configure than Gunicorn and it scales. Further,
Postgres shall serve as our database. To make things more complicated
and because everyone tells us to do so, we also add nginx into the mix
to reverse-proxy our visitor's requests.

In our first attempt, we spin up an Ubuntu image and pretend we've
just logged into a fresh server onto which we want to deploy our
app. Here's our `Dockerfile`:

``` text
FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install build-essential \
                    python3 \
                    python3-dev \
                    python3-pip && \
    pip3 install --upgrade pip && \
    pip3 install uwsgi
```

Hum. That doesn't seem quite right. Already a thousand lines spent
only to be able to execute some python 3. Surely there must be a
better way?

After some procrastination and clueless surfing on Docker Hub,
enlightenment: A [Python 3 image][python_3_image] is available. Let's
grasp the opportunity and learn how those Python 3 Docker Image People
wrote their Dockerfile. After a [quick look][python_3_dockerfile], it
dawns on us that there's all sorts of Voodoo going on there. Maybe
another time.

Anyway, we don't want to understand things, we want to containerize
them. Let's use that python3 image now.

``` text
FROM python:3.6

RUN apt-get update && \
    apt-get install -y && \
    pip3 install uwsgi
```

Looks better already. Let's copy our app into the container, too.

``` text
COPY ./app /opt/app

RUN pip3 install -r /opt/app/requirements.txt

ENV DJANGO_ENV=prod
ENV DOCKER_CONTAINER=1

EXPOSE 8000

CMD ["uwsgi", "--ini", "/opt/app/uwsgi.ini"]
```

Ah, almost done. But we're always almost done, right? So what's going
on here: First, we copy our app (which resides in the same directory
as the Dockerfile) into the docker container. In the container, it
will be in the directory `/opt/app`.

Next, we `pip3 install` our Python 3 App requirements. You do have a
`requirements.txt` and some sort of [workflow][pip_workflow] for it,
right?

We then set the environment variable `DJANGO_ENV` to `prod`, telling
our Django App that we're in production and serious production settings
should be used instead of our usual development settings. You could
read this variable in your `settings.py` like so:

``` python
if os.getenv('DJANGO_ENV') == 'prod':
    DEBUG = False
    ALLOWED_HOSTS = ['.snakeoil.com']
    # ...
else:
    DEBUG = True
    ALLOWED_HOSTS = []
```

Be sure to use `os.getenv('KEY')` and not `os.environ['KEY']` as the
latter will throw a `KeyError` if the key doesn't exist whereas the
former will return `None`. As we're probably not setting this variable
to any value in development, we should choose the former.

Continuing to go through our Dockerfile, we type `EXPOSE 8000` to tell
Docker to expose port 8000 to the host. Why do we need to do that? All
Docker containers are isolated by default meaning their file system
and network can not interact with the host. And that's a good thing,
right? Our containers are nice and isolated. However, we developers
now have to jump through all sorts of hoops to get into our
containers. But let's procrastinate and sort that out later.

Finally, we run uwsgi with our config `uwsgi.ini` which should look
similar to this:

``` text
[uwsgi]
http-socket = :8000
chdir = /opt/app
module = serious_django.wsgi
master = 1
processes = 2
threads = 2
```

It's important to note that we are using http-sockets instead of uwsgi
sockets. This yields slightly worse performance but makes it easier to
debug, as we can point our browser to `127.0.0.1:8000` and actually
see something. As the performance difference most
likely [does not matter][uwsgi_http_so_1], luckily we should be able
to scale anyway.

The rest is pretty straightforward as it's the base config for any
sort of Python WSGI application for uWSGI. Setting the number of
processes and threads correctly for optimum performance
involves [some sort of Voodoo][uwsgi_things_to_know] and we therefore
simply choose processes = cores and threads = 2.

## Dockerizing the Database

To get a feel for things, let's play around a bit with containerized
Postgres. We shall name our container `our_db` for better
identification later on.

``` shell
sudo docker run -it --name our_db postgres:9.6
```

Hum. Now our terminal is full of stuff and we can't do
anything. `ctrl-c` brings us out but also shuts our container
down. What did we do? By passing the flags `-it` (short for `-i -t`,
in case that wasn't obvious) we start our Docker container in an
interactive session which allows us to see its output and input some
input.

To start our container without hooking up our shell to it, we type:

``` shell
sudo docker run -d --name my_db postgres:9.6
```

And it obediently runs in the background.

But have we thought about persistence yet? What happens when we write
to our database, where is the data saved and what happens to the data
once we trash the container?

Think of the container as a simple virtual machine with Postgres
installed. All written data ends up in
`/var/lib/postgresql/data`. Once you remove the virtual machine, it's
gone. Same goes for the Docker container: The data ends up in the same
directory in the container and once you remove the container,
everything's lost.

But worry not, according to Docker best practices, our containers
should be immutable and therefore not have this sort of data in them,
anway.

Let's procrastinate once more and get to that later. First, we need to
learn how to shell into a container and execute stuff.

## Shell into a container

How do we get into it, though?
"Simple", we fire up a shell:

``` shell
sudo docker exec -it my_db \\
                 /bin/bash
```

Note that the double backslashes are added for readability.

We make docker execute `/bin/bash`, thereby creating a new shell for
us without forgetting to add the flags `-it` again, otherwise things
get weird.

So, now we've got a shell in our container. Why did we need that? No
idea. How about some sql:

``` shell
psql -U postgres
\l
```

Well, that wasn't really sql, but we now can see which databases currently
exist. No surprises there. Let's exit psql with `\q` and the
container's shell with `ctrl-d`.

So there's actually a shortcut to that:

``` shell
sudo docker exec -it my_db \\
                 psql -U postgres
```

Good to know. Now we have the tools to learn how to persist data
correctly.

## Persisting data

For persisting data in Docker, we have two options: Mounting a
directory of the machine which is running Docker (the "host") or
creating a Docker data volume. Both are set via the `-v` flag. Let's
have a look at them.

### Mounting a host directory

``` shell
sudo docker run -d --name my_db \\
                -v /host/path:/container/path \\
                postgres:9.6
```

Simple. The first path is the directory on the host, the second path
is the directory in the Docker container which is created there if it
doesn't exist. Be sure to use an absolute path for the host directory,
as otherwise you may be inadvertently...

### Creating and mounting a Docker data volume

``` shell
sudo docker run -d --name my_db \\
                -v db_volume:/container/path \\
                postgres:9.6
```

This creates the Docker data volume `db_volume` and mounts it in the
specified container directory.

But where do we find our Docker data volumes? `docker volume` is your
friend.

``` shell
sudo docker volume ls
```

`ls` lists all your docker volumes and `create` and `rm` do what you would
expect. I find `prune` particularly useful, as it deletes all volumes
which are not linked to any container (i. e., the containers which
were created with them do not exist any more).

### Putting it together

Due to Postgres saving data to `/var/lib/postgresql/data` out of the
box, we have to slightly modify our command to persist our Postgres
data correctly:

``` shell
sudo docker run -d --name my_db \\
                -v db_volume:/var/lib/postgresql/data \\
                 postgres:9.6
```

Ah, there we are. Everything nice and containerized.

We're done, right? Nope. Like with all new technologies, every
solution yields two new questions. This time, those are:

How do we access our data volume from the host? And what about
Postgres backups?

### Accessing data volumes from the host

Let's try to answer both questions with one answer, keeping the
question growth linear instead of exponential. Say, we want to backup
our Postgres database once in a while and would like to actually be
able to access that backup (quite an outrageous idea, I know).

Let's create a new volume pg_backups and spin up a Postgres container
once again:

``` shell
sudo docker run -d --name my_db \\
                -v db_volume:/var/lib/postgresql/data \\
                -v pg_backups:/pg_backups \\
                postgres:9.6
```

Now, in our Postgres container we are able to access the directory
`/pg_backups` which points to the data volume with the same name. How
about dumping our db and copying it to the host. But first, let's create
a database to export:

``` shell
sudo docker exec my_db -it psql -U postgres
CREATE DATABASE serious_db;
```

Exit with `ctrl-d`. We have created some serious data.

Now, onwards. Dump it:

``` shell
sudo docker exec my_db -it /bin/bash
pg_dump serious_db > /pg_backups/serious_db_20170709.sql
```

Done! Now it's in our `pg_backups` data volume. Hm, that doesn't help
much. We still can't access it from the host. To do that, our options
boil down to two:

- Instead of having created `pg_backups` as a data volume, we could
  have mounted a host directory instead, e.g., linking `/pg_backups`
  in the container to `/host/some_path/`. This would certainly make
  accessing backups easier at the cost of making the container more
  host-dependent by mounting a host directory all the time and having
  to specify the same host directory each time we spin up new one. If
  you want to go down this path, see the command above to mount host
  directories.
- Access our pg_backups data volume from yet another instance we spin
  up which has also mounted a host directory. This is slightly more
  complex, therefore we choose it. It also has the nice effect of
  keeping our Postgres container nice and isolated from the host,
  accessing `pg_backups` only when we need to.

This time, I'm choosing Ubuntu as an image, simply because I know my
way around and haven't thought much about other options. I only need
to copy stuff, so probably one could choose alpine or whatever to save
space.

Let's quickly close the gate of the bike shed and get started:

``` shell
sudo docker run --rm -it \\
                -v pg_backups:/pg_backups \\
                -v /host/dir/pg_backups:/host_backups \\
                ubuntu:16.04

cp /pg_backups/* /host_backups/
```

Once we hit `ctrl-d`, our Ubuntu container nods approvingly and
disappears forever (hence the `--rm`). So what did we do?

We created a new container which had two mounts: One pointing to our
well-known `pg_backups` data volume, mounting it in the container at
`/pg_backups`. This is the exact same data volume which is currently
also mounted in our Postgres container! It therefore includes our
precious `serious_db_20170709.sql` file.

The other one mounts a host directory `/host/dir/pg_backups` (which
should exist, but be empty) into `/host_backups` in the container.

We then proceed to copy all backups in `/pg_backups` into the host
directory `/host_backups`.

In simplified terms, we "bridge the gap" between data volume and host
by creating a container which has mounted both, copying the files we
need. Sounds easy now, right?

## Composing containers

But how do we hook up our database to our Django
container? `docker-compose` answers that question and makes us pose
many more.

For some reason, docker-compose files are to be written in YAML. Let's
give it a go and whip up a `docker-compose.yml`:

``` yaml
version: '3'

services:
  db:
    image: postgres:9.6
    expose:
      - 5432
    volumes:
      - pg_data:/var/lib/postgresql/data
      - pg_backups:/pg_backups
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db

volumes:
  pg_data: {}
  pg_backups: {}
```

That's a lot of stuff right there. First, we define the version of our
docker-compose file (3). This stuff is evolving quickly and you may find
examples on the internet which refer to older versions. By the time
you've found this blog entry, we already may be at version 100.

Look at the bottom. Here, we define our volumes, `pg_data` and
`pg_backups`. The curved brackets are empty maps, we could pass some
options here instead, but for now we'll settle with the defaults.

Looking back at the top, we define our containers (or, um,
"services"). First up is our db container, based off the Docker Hub
Postgres image, version 9.6, exposing the default Postgres
port 5432. It has two data volume mounts, namely `pg_data` and
`pg_backups`. To polish things a little bit, we define the Postgres
username and password. Note that the definition of the username is
actually not needed, as the default username already is `postgres`.

Our next service, web, is not based off a Docker Hub image - it's
based off our Dockerfile which we wrote earlier, hence the `build: .`,
assuming that our docker-compose.yml is in the same directory as the
Dockerfile, of course. We map port 8000 to the hosts port 8000,
meaning that our app server will be reachable in the host via
`127.0.0.1:8000` once it's running. Finally, we specify that this
container relies on our db container being started up first, so
docker-compose can plan the startup order of our containers
accordingly.

Behind the scenes, docker-compose links these two containers together
so that they will be able to communicate as if they were in the same
network. Further, it creates our data volumes and mounts them in the
specified locations.

Let's give it a go:

``` shell
sudo docker-compose up
```

Your shell should be flooded with text, good job. It's interesting to
see that the output of each container is prefixed with its name,
e.g. `db_1 |`.

To stop this madness, hit `ctrl-c`.

As always, we have solved some problems while creating some more. Now,
our database server is isolated from our Django app (uWSGI) server
which is a good thing. However, we will have to point our Django app
to our new database location. Open up your `settings.py` and modify this bit:

``` python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'serious_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': POSTGRES_HOST,  # <-- this is new
        'PORT': '5432',
    }
}
```

We set our database host to the variable `POSTGRES_HOST`. Further up,
insert this:

``` python
if os.getenv('DOCKER_CONTAINER'):
    POSTGRES_HOST = 'db'
else:
    POSTGRES_HOST = '127.0.0.1'
```

Remember how we set the environment variable `DOCKER_CONTAINER` in our
Dockerfile at the beginning? Now it helps us by being able to query
whether our Django App is running in a container und setting the
database host accordingly. `db` refers to the hostname of our database
which is specified in our `docker-compose.yml`.

Please note that the art of splitting development and production
settings has more history than meets the eye in this simple
example. This is just a rather quick way of doing things. There
certainly would be more polished ways and, as always,
there's
[an article in the epic Django docs][django_docs_splitting_settings]
on that.

### Django migrations in Docker

More progress, more questions. How do we run Django migrations now?
Easy. Start up our composition if it is not running yet with `sudo
docker-compose up`, then:

``` shell
sudo docker-compose exec web /bin/bash
cd /opt/app
python3 manage.py migrate
```

And hopefully your web container obediently replies with some applied
migrations. But what exactly did we do here?

First, we opened up a shell in our web container. Note the difference:
This time, we're using `docker-compose exec` instead of `docker
exec`. Does it matter? It depends. You could of course look up the
auto-generated name of your web container, most likely
`projectname_web_1` and simply run our old friend `docker exec -it`
with the same options. However, if you have multiple containers with
the same name and want to apply a command to all of them at the same
time, you will need `docker-compose exec`.

From there on it's straight sailing: Change the directory to the
Django app directory and run the migrations.

## Dockerizing nginx

We're almost done with our seriously containerized deployment
stack. The last step would be placing nginx in front of uWSGI. Why
would we want to do that? Do we have to? The answer
is [we don't][uwsgi_nginx_serverfault] but we should because, well,
everyone else does it and then it must be good, right?

Here's the plot outline: Our nginx webserver should run on port 80 and
443, serving http and https requests respectively. The SSL certifiate
should be acquired via [Let's Encrypt][letsencrypt] and somehow be
renewed automatically. The requests should be proxied to our uWSGI
server running on port 8000.

So, what are our options?

- Continue containerizing everything and containerize nginx.
- Run nginx in the host os ("bare metal") and set everything up the
  old-school way.

Let's think about the first option. At least two problems arise:

1. The process of acquiring, saving and renewing the SSL certificate
   makes our container stateful, violating the "immutable container"
   best practice.
2. Our nginx container will block our ports 80 and 443, being coupled
   to one website (our serious Django app). What do we do if we want
   to host multiple websites (on diffent domains) on these ports with
   the same nginx instance?

Of course, we are not the first people to ask these questions and
there are nifty solutions out there already: For example, there's
the [letsencrypt-nginx-proxy-companion][nginx_letsencrypt_docker]
which basically solves these problems but is not trivial to set up and
understand.

So, should we containerize nginx? Let's see what I did...

### Not containerizing nginx

Here's my answer: I didn't. To be honest, I had been hacking away with
Docker for three days already and was tired of containerizing
things. Thinking about the above two problems, this time I took the
easy way out instead of containerizing everything (sorry!) - I set it
up in the host os.

I won't go into much detail here as DigitalOcean has
a [a great guide][do_guide_nginx_letsencrypt] on exactly this topic
and our setup differs only slightly from theirs. Here's our simplified
nginx site config, sitting in
`/etc/nginx/sites-available/serious_project`:

``` nginx
upstream app {
    server 127.0.0.1:8000;
}

server {
    listen 80 default_server;
    server_name serious-project.com;

    location / {
        allow all;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Cluster-Client-Ip $remote_addr;
        proxy_pass http://app;
    }
}
```

Link and test the settings file, nudge nginx to reload and we're rolling:

``` shell
sudo ln -s /etc/nginx/sites-available/serious_project \\
           /etc/nginx/sites-enabled/serious_project
sudo nginx -t
sudo systemctl reload nginx
```

Finally, it's time to setup Let's Encrypt and modify our nginx config
accordingly. For instance, all http traffic on port 80 should be
redirected to https. This is left as an exercise to the avid reader
and beautifully described in the linked DigitalOcean article.

## Summary

Containerizing things is _fun_. However, in the beginning it's not
very intuitive and first steps can be quite demoralizing making you
shout "Damn it! I'm setting this thing up old-school!".

On the JavaScript-scale of frustration (10 = Node.js, 0 = Django),
Docker definitely ranks somewhere around 7. But once you've grasped
the basic concepts of Docker and things start working nicely together,
it's almost as rewarding as when you've created your first to-do app
in React and it doesn't crash on input.

Have fun containerizing things!

I'd like to thank [@mhubig][mhubig], [@wshayes][wshayes]
and [@messa][messa] for their corrections in the comments. Who would
have known, there are always some more best practices to follow :)


[python_3_image]: https://hub.docker.com/_/python/
[python_3_dockerfile]: https://github.com/docker-library/python/blob/88ba87d31a3033d4dbefecf44ce25aa1b69ab3e5/3.6/Dockerfile
[pip_workflow]: https://www.kennethreitz.org/essays/a-better-pip-workflow
[django_docs_splitting_settings]: https://code.djangoproject.com/wiki/SplitSettings
[uwsgi_http_so_1]: https://stackoverflow.com/questions/11783907/is-uwsgi-protocol-faster-than-http-protocol
[uwsgi_things_to_know]: http://uwsgi-docs.readthedocs.io/en/latest/ThingsToKnow.html
[uwsgi_nginx_serverfault]: https://serverfault.com/questions/590819/why-do-i-need-nginx-when-i-have-uwsgi
[letsencrypt]: https://letsencrypt.org
[nginx_letsencrypt_docker]: https://hub.docker.com/r/jrcs/letsencrypt-nginx-proxy-companion/
[do_guide_nginx_letsencrypt]: https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04
[mhubig]: https://github.com/mhubig
[wshayes]: https://github.com/wshayes
[messa]: https://github.com/messa
