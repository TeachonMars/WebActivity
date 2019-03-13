# Web activity
## Before we start
If you have any question related to web activities, or any other kind of integration with Teach on Mars, please consider joining the [Teach on Mars Integration slack community](https://join.slack.com/t/integration-on-mars/shared_invite/enQtNTc1NTQxODA3NTcwLTNiM2E3N2FhYjkzY2VjMmExYjRhOTkyNDhhZjNmNzQ5MzRiMzkwYzU5OWY3NjgxNmI3OWNlNjcyYjg1YWRjZmI).

## Introduction
Teach on Mars offers a wide variety of mobile learning activities including courses, quizzes and games, and we regularly create new ones... but you may want more, right now! Good news, it is possible! With Teach on Mars, you can import a web content in a Teach on Mars training course just like any other activity. 
 
This can be useful for various purposes:
* Reuse a web content that you already own (from a previous LMS, for instance)
* Create a brand new type of activity (e.g. including VR or AR)
 
How can you create such a web activity? Simply use one of the various authoring tools available on the market. If you don’t know any, try to look for “mobile learning authoring tools” on your favorite search engine. (For more information, please refer to the “Known content type compatibility” section at the end of this document.)
Usage data like progress, score, success and time spent in your web activity can be sent to the Mission Center and added to the dashboards and exports. There are two ways to do this:
* Use the ToM JavaScript library in your web content
* Use a SCORM compatible content (1.2 and 2004 are supported)


You will find more detailed information in the [Web activity documentation](https://github.com/TeachonMars/WebActivity/raw/master/doc/ToM%20Web%20Activity%20documentation.pdf).

## Walk through
### Requirements
* Any Git client
* A local web server
* Your favorite web IDE

### Step by step
1. Clone this repository in a directory on your local web server
2. Have the _simulator_ directory accessible through a URL on your local server (it must be under the same domain to avoid cross-domain issues)
3. Open the _simulator_ URL you've just set up in your favorite web browser
4. Fill the URL in the header with the URL you're using to test your development


## How to use the simulator ##
### Open the simulator URL

If you local server root is

    http://www.local

and the root of this package is

    WebActivity/

then the URL to access the simulator should be

    http://www.local/WebActivity/simulator

### The simulator interface

![The home web home simulator interface](https://raw.githubusercontent.com/TeachonMars/WebActivity/master/doc/simulator-1.png "The web activity simulator interface")

**Caption**
1. URL input: this is where you can enter an URL where the built version of your project can be viewed.
2. _Load_ button: one click loads the project from the URL into the frame below.
3. _Close_ button: one click empties the content frame. It allows you to test _unload_ events.
4. _Relaunch_ button: one click does a _Close_ and a _Load_.
5. _Toggle sessions_ button: toggles the display of the sessions panel.
6. Sessions panel: this panel shows the session data that are sent to the Mission Center.
7. Resize tool: this form allows you to test different screen sizes.

When opening the simulator, the first screen is an example of a content loaded in the simulator. This content is a smal tutorial that explains how to send and get data to and from the Mission Center.


