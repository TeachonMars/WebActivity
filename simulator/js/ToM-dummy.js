window.learnerProfile = {
    "learnerId": "AAAAA",
    "firstname": "Jenny",
    "lastname": "Smith",
    "avatar": {
        "url": "../assets/learner/profile.png"
    },
    "lang": "en",
    "points": 1458
};


window.trainingCourses = [
  {
    "accessible": true,
    "categories": [
      "category-1"
    ],
    "certified": false,
    "completed": false,
    "cover": {
      "url": "../assets/courses/training-course-1-750x545.jpg"
    },
    "demo": false,
    "description": "Ut nostrud laboris ex id deserunt duis in veniam do velit excepteur ea esse aliqua ut exercitation consectetur deserunt tempor sunt ullamco labore laborum magna magna ut eiusmod ut ut dolore et deserunt aute dolore.",
    "id": "training-course-1",
    "recommended": false,
    "sandbox": false,
    "thumbnail": {
      "url": null
    },
    "title": "Colonizing Mars",
    "updateAvailable": false
  },
  {
    "accessible": true,
    "categories": [
      "category-1"
    ],
    "certified": false,
    "completed": false,
    "cover": {
      "url": "../assets/courses/training-course-2-750x545.jpg"
    },
    "demo": false,
    "description": "Ut nostrud laboris ex id deserunt duis in veniam do velit excepteur ea esse aliqua ut exercitation consectetur deserunt tempor sunt ullamco labore laborum magna magna ut eiusmod ut ut dolore et deserunt aute dolore.",
    "id": "training-course-2",
    "recommended": false,
    "sandbox": false,
    "thumbnail": {
      "url": null
    },
    "title": "Exploring Jupiter",
    "updateAvailable": false
  },
  {
    "accessible": true,
    "categories": [
      "category-2"
    ],
    "certified": false,
    "completed": false,
    "cover": {
      "url": "../assets/courses/training-course-3-750x545.jpg"
    },
    "demo": false,
    "description": "Ut nostrud laboris ex id deserunt duis in veniam do velit excepteur ea esse aliqua ut exercitation consectetur deserunt tempor sunt ullamco labore laborum magna magna ut eiusmod ut ut dolore et deserunt aute dolore.",
    "id": "training-course-3",
    "recommended": false,
    "sandbox": false,
    "thumbnail": {
      "url": null
    },
    "title": "The work of engineers",
    "updateAvailable": false
  }
];

window.learnerTrainingCourses = _.map(
    _.slice(window.trainingCourses, 0, Math.min(1, window.trainingCourses.length)),
    function(t) {
        switch(t.id) {

            case "training-course-1":
                t.progress = 30;
                break;
            default:

        }
        return t;
    });


window.communications = [
    {
        "type": "article",
        "id": "communication-1",
        "featured": true,
        "title": "Discover our brand new gas giant",
        "featuredImage": {
            "url": "../assets/communications/communication-1-750x545.jpg",
            "imageSize": {
                "height": 720,
                "width": 545
            }
        },
        "description": null,
    },

    {
        "type": "article",
        "id": "communication-2",
        "featured": true,
        "title": "This is Mars, Earth's red little sister",
        "featuredImage": {
            "url": "../assets/communications/communication-2-750x545.jpg",
            "imageSize": {
                "height": 720,
                "width": 545
            }
        },
        "description": null,
    },

    {
        "type": "image",
        "id": "communication-3",
        "featured": true,
        "title": "Our team is working hard",
        "featuredImage": {
            "url": "../assets/communications/communication-3-750x545.jpg",
            "imageSize": {
                "height": 720,
                "width": 545
            }
        },
        "description": "Officia labore ea ex et veniam nostrud ut ut magna consectetur.",
    },



    {
        "type": "article",
        "id": "communication-4",
        "featured": false,
        "title": "Discover our brand new gas giant",
        "image": {
            "url": "../assets/communications/communication-1-750x545.jpg",
            "imageSize": {
                "height": 720,
                "width": 545
            }
        },
        "description": null,
    },

    {
        "type": "article",
        "id": "communication-5",
        "featured": false,
        "title": "This is Mars, Earth's red little sister",
        "image": {
            "url": "../assets/communications/communication-2-750x545.jpg",
            "imageSize": {
                "height": 720,
                "width": 545
            }
        },
        "description": null,
    },

    {
        "type": "image",
        "id": "communication-6",
        "featured": false,
        "title": "Our team is working hard",
        "image": {
            "url": "../assets/communications/communication-3-750x545.jpg",
            "imageSize": {
                "height": 720,
                "width": 545
            }
        },
        "description": "Officia labore ea ex et veniam nostrud ut ut magna consectetur.",
    }
];


window.featuredCommunications = _.filter(window.communications, function(c) { return c.featured; });

window.categories = [
    {
        "id": "category-1",
        "title": "Solar system",
        "children": [
            {
                "id": "category-1-2",
                "title": "Planets",
                "children": [],
                "parent": null,
                "image": {
                    "url": "../assets/categories/category-1-2-750x270.jpg"
                }
            }
        ],
        "parent": null,
        "image": {
            "url": "../assets/categories/category-1-750x270.jpg"
        }
    },
    {
        "id": "category-2",
        "title": "Our team",
        "children": [],
        "parent": null,
        "image": {
            "url": "../assets/categories/category-2-750x270.jpg"
        }
    }
];
