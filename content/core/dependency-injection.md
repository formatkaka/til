---
title: "Dependency Injection"
date: "2024-01-08"
tags: ["architecture"]
category: "core"
---

<b><u>Short definition</u></b> - Dependency injection means giving an object its instance variables.



### Explanation

Any application is composed with many classes that collaborate each-other to perform some useful stuff. Traditionally each object is responsible for obtaining its own references to the dependent objects (dependencies) it collaborate with. This leads to highly coupled classes and hard-to-test code.
For example ,
Consider a Car object. A Car depends on Wheels, Engine, Fuel, Battery... etc to run. Traditionally we define the brand of such dependent objects along with the definition of Car object.

    class Car{
    private Wheel wh= new NepaliRubberWheel();
    private Battery bt= new ExcideBattery();
    //rest
    }

Here, Car object is responsible for creating the dependent objects.
What if we want to change the type of its dependent object - say Wheel after the previous NepaliRubberWheel() punctures.
We need to redefine the Car object with its new dependency say ChineseRubberWheel(), But only the Car manufacturer can do that.

Then what the Dependency Injection stand for ...
When using Dependency Injection, objects are given their dependencies on run time rather than compile time(car manufacturing time). In other words objects are configured by an external entity(by us not by manufacturer).
So we can now change the Wheel whenever we want. Here, the Dependency (Wheel) is injected to Car at run time. That is called Dependency Injection.

Benefits of DI

    Key benefit is loose coupling between dependent objects.If an object operates on their dependencies by their interface not by implementation then compile time dependency can be swapped out with Dependency Injection.
    Very useful when we have objects (Wheel) whose implementations change often ( if the type punctures often we can change it easily) ?
    Very useful for large projects where there is issue of maintainability, simplicity and many others ty…

Source - 

[1] https://www.jamesshore.com/Blog/Dependency-Injection-Demystified.html

[2] http://ganeshtiwaridotcomdotnp.blogspot.com/2011/05/understanding-dependency-injection-and.html