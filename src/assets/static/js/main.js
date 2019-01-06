"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/* eslint-disable no-var, no-use-before-define */

var $ = $ || window.jQuery;

function panels(){
    $("#panel").parent().css({
        padding: 0
    });
    $("#panel").css({
        width: $(".panel-side").innerWidth(),
        minHeight: window.innerHeight,
        paddingTop: (window.innerHeight - $("#panel").innerHeight()) * 0.4
    }).show();
}

function setupPanels(){
    $(".panel-side").css({
        width: $(".panel-side").parent().innerWidth(),
        left: $(".panel-side").parent().position().left + "px"
    });

    $(".content").css({
        minHeight: window.innerHeight
    });

    if (window.innerWidth < 1200) {
        $("#panel").parent().hide();
        $(".content").removeClass("col-md-7").addClass("col-md-12");
        $("header").show();
        $("body").css({
            paddingTop: 30
        });
    }
    else {
        $("#panel").parent().show();
        $(".content").removeClass("col-md-12").addClass("col-md-7");
        $("header").hide();
        $("body").css({
            paddingTop: 0
        });
        panels();
    }
}

function getAge(){
    var date = moment("1999-05-29").startOf("minute");

    var ageYears = moment().diff(date, "years");
    var ageMonths = moment().subtract(ageYears, "years").diff(date, "months");
    var ageDays = moment().subtract(ageYears, "years").subtract(ageMonths, "months").diff(date, "days");

    $(".age-years").text(ageYears);
    $(".age-months").text(ageMonths);
    $(".age-days").text(ageDays);
}

$(document).ready(function(){
    setupPanels();
    $(window).resize(function(){
        setupPanels();
    });

    // Welcome Message
    console.log("\n%c> -------=========[0]=========------- <", "color: green; font-weight: bold;");
    console.log(
        "%c> ---    " +
        "%cWELCOME TO NULLDEV.ORG   " +
        "%c--- <",
        "color: green; font-weight: bold;",
        "color: blue;  font-weight: bold;",
        "color: green; font-weight: bold;"
    );
    console.log(
        "%c> ---      " +
        "%cENJOY YOUR STAY " +
        "%c:)     " +
        "%c--- <",
        "color: green; font-weight: bold;",
        "color: blue;  font-weight: bold;",
        "color: red;   font-weight: bold;",
        "color: green; font-weight: bold;"
    );
    console.log("%c> -------=========[0]=========------- <", "color: green; font-weight: bold;");

    // Scroll Up
    $("#toTop").on("click", function(e){
        $("body, html").animate({
            scrollTop: 0
        }, 800);
        e.preventDefault();
    });

    getAge();

    // Open external links in new tab
    $("a").attr("target", function(){
        if (this.host && this.host != location.host) return "_blank";
    });

    $("a").attr("rel", function(){
        if (this.host && this.host != location.host) return "noopener";
    });
});
