(function () {
  var colors = new Colors();
  var size = 15;
  var notification = new Notification("");

  window.addEventListener("load", function () {
    getListItems();
  });

  //On change, adds functionality
  window.addEventListener("hashchange", function () {
    getListItems();
  });

  /* get all the choices and send to main func*/
  function getListItems() {
    if (document.body.hasAttribute("meatball_override")) {
      var overrides = window.meatball_override;
      overrides.forEach(function (item) {
        colors.set(item.value, item.color);
      });
    }
    //Step 1. Get all the tables -- create array
    var tables = [].slice.call(document.getElementsByTagName("table"));
    if (errorChecking(tables)) {
      console.log("No Tables Found");
      return;
    }
    //Include only the actual lists
    tables = tables.filter(function (table) {
      return table.getAttribute("class") === "ms-listviewtable";
    });
    //Grabbing the list url + Iterate through the set of tables
    tables.forEach(function (table, index) {
      var currentListId = table.getAttribute("id").substring(1, 37);
      var root = ctx.HttpRoot;
      var url =
        root +
        "/_api/web/lists('" +
        currentListId +
        `')/fields?$filter=TypeDisplayName eq 'Choice'`;
      var configureAxios = {
        headers: {
          Accept: "application/json; odata=verbose",
          "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
        },
        credentials: true,
      };
      axios
        .get(url, configureAxios)
        .then(function (res) {
          if (res.data && res.data.d) {
            var popoverData = res.data.d.results.reduce(
              function (acc, cv, ci, data) {
                var add = true;
                if (cv.Choices) {
                  if (acc.value.indexOf(cv.Choices.results) < 0) {
                    acc.value.push(cv.Choices.results);
                    acc.internalColumn.push(cv.InternalName);
                    acc.externalColumn.push(cv.Title);
                  }
                }
                return acc;
              },
              {
                externalColumn: [],
                internalColumn: [],
                value: [],
              }
            );
            console.log("popoverData:", popoverData);
            popoverData.value.forEach(function (item, i) {
              findTargets(
                table,
                item,
                popoverData.externalColumn[i],
                popoverData.internalColumn[i]
              );
            });
          }
          return false;
        })
        .catch(function (e) {
          console.log("Error: Get list choices request Failed", e);
        });
    });
  }

  //Entry Point and General Function
  function findTargets($table, values, externalColumn, internalColumn, colors) {
    if (!$table || $table.childNodes.length === 0) {
      return;
    }

    //deafult keywords that have values.
    var defaults = [
      { color: "green", text: "up" },
      { color: "red", text: "down" },
      { color: "yellow", text: "degraded" },
      { color: "green", text: "100-90" },
      { color: "yellow", text: "89-80" },
      { color: "red", text: "79-10" },
      { color: "steelblue", text: "<10" },
    ];

    //Step 3. Iterate over each cell and compare the inner text to the list of known defaults.
    var $rows = [].slice.call($table.getElementsByTagName("tr"));
    var thead = [].slice.call($table.getElementsByTagName("th"));
    var displayValue = "";
    var displayColor = "";

    $rows.map(function ($row, ri) {
      displayValue = "";
      var $cells = [].slice.call($row.getElementsByTagName("td"));

      if ($cells.length > 0) {
        //this checks if the cell contains the text which is in user choices, select that cell to add the modal
        $cells.map(function ($cell, ci) {
          //new logic
          var text = $cell.innerText;
          var defaultText = defaults.map(function (a) {
            return a.text;
          });
          var pos = defaultText.indexOf(text.toLowerCase());

          //Get the position of the td and find the c
          var add = false;
          if (thead[ci]) {
            [].slice.call(thead[ci].children).forEach(function (item, ti) {
              [].slice.call(item.children).forEach(function (item, tci) {
                if (item.innerText) {
                  if (containsString(item.innerText, "status")) {
                    add =
                      !containsString(item.innerText, "value") &&
                      !containsString(item.innerText, "type");
                    if (containsString(externalColumn, item.innerText)) {
                      //Pseudo function
                      if (
                        externalColumn.split(" ").length - 1 ===
                        item.innerText.split(" ").length
                      ) {
                        displayValue = $cell.innerText;
                      }
                    } else {
                      add = false;
                    }
                  }
                }
              });
            });
          }

          if (add && $table.getAttribute("id") && $row.getAttribute("iid")) {
            [].slice.call($cell.children).forEach(function (item, i) {
              [].slice.call(item.children).forEach(function (item, i) {
                if (!displayValue) {
                  displayValue = item.getAttribute("key");
                } else if (displayValue.length < 1) {
                  displayValue = item.getAttribute("key");
                }
              });
            });
            if (displayValue) {
              addPopover(
                $cell,
                values,
                displayValue,
                $row.getAttribute("iid").split(",")[1],
                thead[ci],
                $table.getAttribute("id").substring(1, 37),
                externalColumn,
                internalColumn
              );
            }
          }
        });
      }
    });
  }

  /*
    This creates the popover for each cell
  */
  function addPopover(
    target,
    defaults,
    displayValue,
    rowIndex,
    thead,
    table,
    externalColumn,
    internalColumn
  ) {
    var popoverBC = "#ffffff";
    var triangleSize = 15;

    var popoverPanel = document.createElement("div");
    popoverPanel.style.display = "inline-block";
    popoverPanel.style.margin = "0px";
    popoverPanel.style.padding = "0px";

    var carret = document.createElement("div");
    carret.style.margin = "0px";
    carret.style.display = "inline-block";
    carret.style.position = "fixed";
    carret.style.height = "0px";
    carret.style.width = "0px";
    carret.style.borderTop = triangleSize + "px solid transparent";
    carret.style.borderBottom = triangleSize + "px solid transparent";
    carret.style.borderRight = triangleSize + "px solid " + popoverBC;
    popoverPanel.appendChild(carret);

    //Create Popover Element
    var popover = document.createElement("div");
    popover.style.display = "inline-block";
    popover.style.backgroundColor = popoverBC;
    popover.style.color = "#000000";
    popover.style.padding = ".5rem";
    popover.style.border = "1px solid black";
    popover.style.borderRadius = ".25rem";
    popover.style.zIndex = "1";

    //Create Header Element
    var header = document.createElement("div");
    header.style.padding = ".25rem";
    header.style.borderRadius = ".25rem";
    header.style.textAlign = "center";
    header.style.cursor = "pointer";
    header.style.marginBottom = ".25rem";
    header.style.backgroundColor = "#BABBFD";
    header.innerText = displayValue;

    //Create Options Panel Element
    var options = document.createElement("div");
    options.style.padding = ".25rem";
    options.style.borderRadius = ".25rem";

    //Create and Add Option Elements
    defaults.forEach(function (ele, index) {
      var optionPanel = document.createElement("div");
      optionPanel.style.padding = ".25rem";
      optionPanel.style.marginBottom = ".25rem";
      optionPanel.style.textAlign = "left";
      optionPanel.style.borderRadius = ".25rem";

      var option = document.createElement("div");
      option.innerText = ele;
      option.style.marginLeft = ".25rem";
      option.style.display = "inline";
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.style.margin = "0px";
      radio.style.display = "inline";

      if (containsString(ele, displayValue)) {
        radio.checked = "checked";
        optionPanel.style.backgroundColor = "#BABBFD";
      } else {
        radio.style.cursor = "pointer";
        optionPanel.style.cursor = "pointer";
        optionPanel.addEventListener("click", function () {
          radio.checked = "checked";
          optionPanel.style.backgroundColor = "#BABBFD";
          updateTarget(
            ele,
            rowIndex,
            thead.innerText,
            table,
            externalColumn,
            internalColumn
          );
        });
        optionPanel.addEventListener("mouseenter", function () {
          optionPanel.style.boxShadow = "0px 0px 10px #BABBFD";
        });
        optionPanel.addEventListener("mouseleave", function () {
          optionPanel.style.boxShadow = "0px 0px 0px";
        });
      }

      //Add Click Event to update list
      optionPanel.appendChild(radio);
      optionPanel.appendChild(option);
      options.appendChild(optionPanel);
    });

    //Add Header Element
    popover.appendChild(header);
    //Add Options Panel
    popover.appendChild(options);

    //Add Click Event to display Options Panel
    header.addEventListener("click", function () {
      var style = options.style.display;
      var change = false;
      change = style === "block";
      change
        ? (options.style.display = "none")
        : (options.style.display = "block");
    });

    popoverPanel.appendChild(popover);

    //Used addEventListener versus onmouseenter = function due to concerns of
    //overriding other scripts
    //Add Mouse Enter Event to display
    target.addEventListener("mouseenter", function () {
      document.body.appendChild(popoverPanel);

      var left = Math.round(target.getBoundingClientRect().width * (2 / 3));
      popoverPanel.style.position = "fixed";
      popoverPanel.style.left =
        Math.max(
          target.getBoundingClientRect().left + left,
          target.getBoundingClientRect().right
        ) + "px";
      popoverPanel.style.top =
        target.getBoundingClientRect().top - triangleSize / 2 + "px";
      carret.style.left = target.getBoundingClientRect().left + left + "px";
      carret.style.top = target.getBoundingClientRect().top + "px";
    });

    target.addEventListener("mouseleave", function (e) {
      if (popoverPanel.contains(e.relatedTarget)) return;
      if (popoverPanel) {
        if (popoverPanel.parentNode) {
          popoverPanel.parentNode.removeChild(popoverPanel);
        }
      }
    });

    //Add Mouse leave Event to hide
    popoverPanel.addEventListener("mouseleave", function () {
      if (popoverPanel) {
        if (popoverPanel.parentNode) {
          popoverPanel.parentNode.removeChild(popoverPanel);
        }
      }
    });
  }

  function Meatball(size) {
    this.size = size + "px";
    this.element = document.createElement("div");
    this.element.style.width = this.size;
    this.element.style.height = this.size;
    this.element.style.borderRadius = this.size;
  }

  Meatball.prototype.init = function (
    defaults,
    externalColumn,
    internalColumn,
    parent,
    rowIndex,
    thead,
    table,
    value
  ) {
    this.element.style.backgroundColor = colors.get(value);
    var popoverBC = "#ffffff";
    var triangleSize = 15;

    var popoverPanel = document.createElement("div");
    popoverPanel.style.display = "inline-block";
    popoverPanel.style.margin = "0px";
    popoverPanel.style.padding = "0px";

    var carret = document.createElement("div");
    carret.style.margin = "0px";
    carret.style.display = "inline-block";
    carret.style.position = "fixed";
    carret.style.height = "0px";
    carret.style.width = "0px";
    carret.style.borderTop = triangleSize + "px solid transparent";
    carret.style.borderBottom = triangleSize + "px solid transparent";
    carret.style.borderRight = triangleSize + "px solid " + popoverBC;
    popoverPanel.appendChild(carret);

    //Create Popover Element
    var popover = document.createElement("div");
    popover.style.display = "inline-block";
    popover.style.backgroundColor = popoverBC;
    popover.style.color = "#000000";
    popover.style.padding = ".5rem";
    popover.style.border = "1px solid black";
    popover.style.borderRadius = ".25rem";
    popover.style.zIndex = "1";

    //Create Header Element
    var header = document.createElement("div");
    header.style.padding = ".25rem";
    header.style.borderRadius = ".25rem";
    header.style.textAlign = "center";
    header.style.cursor = "pointer";
    header.style.marginBottom = ".25rem";
    header.style.backgroundColor = "#BABBFD";
    header.innerText = value;

    //Create Options Panel Element
    var options = document.createElement("div");
    options.style.padding = ".25rem";
    options.style.borderRadius = ".25rem";

    //Create and Add Option Elements
    defaults.forEach(function (ele, index) {
      var optionPanel = document.createElement("div");
      optionPanel.style.padding = ".25rem";
      optionPanel.style.marginBottom = ".25rem";
      optionPanel.style.textAlign = "left";
      optionPanel.style.borderRadius = ".25rem";

      var option = document.createElement("div");
      option.innerText = ele;
      option.style.marginLeft = ".25rem";
      option.style.display = "inline";
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.style.margin = "0px";
      radio.style.display = "inline";

      if (containsSubString(ele, value)) {
        radio.checked = "checked";
        optionPanel.style.backgroundColor = "#BABBFD";
      } else {
        radio.style.cursor = "pointer";
        optionPanel.style.cursor = "pointer";
        optionPanel.addEventListener("click", function () {
          radio.checked = "checked";
          optionPanel.style.backgroundColor = "#BABBFD";
          updateTarget(
            ele,
            rowIndex,
            thead.innerText,
            table,
            externalColumn,
            internalColumn
          );
        });
        optionPanel.addEventListener("mouseenter", function () {
          optionPanel.style.boxShadow = "0px 0px 10px #BABBFD";
        });
        optionPanel.addEventListener("mouseleave", function () {
          optionPanel.style.boxShadow = "0px 0px 0px";
        });
      }

      //Add Click Event to update list
      optionPanel.appendChild(radio);
      optionPanel.appendChild(option);
      options.appendChild(optionPanel);
    });

    //Add Header Element
    popover.appendChild(header);
    //Add Options Panel
    popover.appendChild(options);

    //Add Click Event to display Options Panel
    header.addEventListener("click", function () {
      var style = options.style.display;
      var change = false;
      change = style === "block";
      change
        ? (options.style.display = "none")
        : (options.style.display = "block");
    });

    popoverPanel.appendChild(popover);

    //Used addEventListener versus onmouseenter = function due to concerns of
    //overriding other scripts
    //Add Mouse Enter Event to display
    this.addEventListener("mouseenter", function () {
      document.body.appendChild(popoverPanel);

      var left = Math.round(this.getBoundingClientRect().width * (2 / 3));
      popoverPanel.style.position = "fixed";
      popoverPanel.style.left =
        Math.max(
          this.getBoundingClientRect().left + left,
          this.getBoundingClientRect().right
        ) + "px";
      popoverPanel.style.top =
        this.getBoundingClientRect().top - triangleSize / 2 + "px";
      carret.style.left = this.getBoundingClientRect().left + left + "px";
      carret.style.top = this.getBoundingClientRect().top + "px";
    });

    this.addEventListener("mouseleave", function (e) {
      if (popoverPanel.contains(e.relatedTarget)) return;
      if (popoverPanel) {
        if (popoverPanel.parentNode) {
          popoverPanel.parentNode.removeChild(popoverPanel);
        }
      }
    });

    //Add Mouse leave Event to hide
    popoverPanel.addEventListener("mouseleave", function () {
      if (popoverPanel) {
        if (popoverPanel.parentNode) {
          popoverPanel.parentNode.removeChild(popoverPanel);
        }
      }
    });
    parent.innerText = "";
    parent.appendChild(this.element);
  };

  function updateTarget(
    ele,
    rowIndex,
    header,
    table,
    externalColumn,
    internalColumn
  ) {
    var site = _spPageContextInfo.webServerRelativeUrl;
    var currentListName = ctx.ListTitle;
    var listName = "SP.ListItem";
    var data = {
      __metadata: { type: listName },
    };
    data[internalColumn] = ele;

    var url =
      site +
      "/_api/web/lists('" +
      table +
      "')/items(" +
      rowIndex +
      ")?$select=" +
      internalColumn;

    var configureAxios = {
      headers: {
        Accept: "application/json; odata=verbose",
        "If-Match": "*",
        "X-HTTP-Method": "MERGE",
        "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
      },
      credentials: true,
    };
    axios
      .post(url, { data: JSON.stringify(data) }, configureAxios)
      .then(function (res) {
        notification.setMessage("Update Success");
        notification.show();
      })
      .catch(function (e) {
        notification.setMessage("Update Failed");
        notification.show();
        console.log(error);
      });
  }

  //Easier way of handling the different colors and defaults
  function Colors() {
    this.blue = "#6063fa";
    this.green = "#27e833";
    this.red = "#d71010";
    this.yellow = "#f6de1c";
    this.defaults = [
      {
        value: "Up",
        color: this.green,
      },
      { value: "Down", color: this.yellow },
      { value: "Degraded", color: this.red },
      { value: "NA", color: this.blue },
      { value: "100-90", color: this.green },
      { value: "89-80", color: this.yellow },
      { value: "79-10", color: this.red },
      { value: "<10", color: this.blue },
    ];
  }

  Colors.prototype.get = function (value) {
    return this.defaults.filter(function (item) {
      if (containsSubString(item.value, value)) {
        return item;
      }
    })[0].color;
  };

  Colors.prototype.set = function (value, color) {
    if (compareString(color, "blue")) {
      this.defaults.push({ value: value, color: this.blue });
    } else if (compareString(color, "green")) {
      this.defaults.push({ value: value, color: this.green });
    } else if (compareString(color, "red")) {
      this.defaults.push({ value: value, color: this.red });
    } else if (compareString(color, "yellow")) {
      this.defaults.push({ value: value, color: this.yellow });
    } else {
      this.defaults.push({ value: value, color: color });
    }
  };

  //In house build of a notification feature
  function Notification(message) {
    this.notification = document.createElement("div");
    this.notification.style.textAlign = "center";
    this.notification.style.fontSize = "16pt";
    this.notification.style.width = "250px";
    this.notification.style.height = "50px";
    this.notification.style.backgroundColor = "white";
    this.notification.style.border = "1px solid black";
    this.notification.style.position = "fixed";
    this.notification.style.right = "10px";
    this.notification.style.top = "10px";
    this.notification.style.zIndex = "1";
    this.notification.style.borderRadius = ".25rem";
    this.notification.innerText = message;
  }

  Notification.prototype.setMessage = function (message) {
    this.notification.innerText = message;
  };

  Notification.prototype.show = function () {
    var note = this.notification;
    document.body.appendChild(note);
    var timer = setTimeout(
      function (note) {
        if (note) {
          if (note.parentNode) {
            note.parentNode.removeChild(note);
          }
        }
      },
      2500,
      note
    );
  };

  Notification.prototype.debug = function () {
    document.body.appendChild(this.notification);
  };

  function parseFormulaColumn(formula) {
    var reg = /([()])/g;
    var parsedFormula = formula.split("IF")[1].split("=")[0].split(",");
    switch (parsedFormula.length) {
      case 1:
        return parsedFormula[0].replace(reg, "");
      case 2:
        return parsedFormula[1].replace(reg, "");
      default:
        throw new Error("Formula incorrect size");
    }
  }

  function parseFormula(formula) {
    return formula.split("IF").reduce(function (acc, cv, ci, init) {
      if (ci !== 0) {
        var splitEqual = cv.split("=");
        switch (splitEqual.length) {
          case 2:
            if (splitEqual[0].indexOf('"') > -1) {
              acc.push([
                splitEqual[0].split('"')[1],
                splitEqual[1].split(",")[1],
              ]);
            } else {
              acc.push([splitEqual[1].split(",")]);
            }
            break;
          case 3:
            if (splitEqual[0].indexOf('"') > -1) {
              acc.push([
                splitEqual[0].split('"')[1],
                (splitEqual[1] + "=" + splitEqual[2]).split(",")[1],
              ]);
            } else {
              var temp = splitEqual[1] + "=" + splitEqual[2];

              acc.push([temp.split(",")]);
            }
            break;
          case 4:
            if (splitEqual[0].indexOf('"') > -1) {
              acc.push([
                splitEqual[0].split('"')[1],
                (
                  splitEqual[1].split(",")[1] +
                  "=" +
                  splitEqual[2] +
                  "=" +
                  splitEqual[3]
                ).replace(",", ""),
              ]);
            } else {
              var temp = (
                splitEqual[1].split(",")[1] +
                "=" +
                splitEqual[2] +
                "=" +
                splitEqual[3]
              ).replace(",", "");
              acc.push([temp]);
            }
            break;
          default:
            break;
        }
      }
      return acc;
    }, []);
  }

  //True, error.  False, no error.
  function errorChecking(obj) {
    if (!obj) {
      console.error("Undefined");
      return true;
    }

    if (obj.length) {
      if (obj.length === 0) {
        console.error("Nothing in the array");
        return true;
      }
    }

    return false;
  }

  function containsSubString(knownValue, givenValue) {
    return (
      givenValue
        .slice(0, knownValue.length)
        .toLowerCase()
        .indexOf(knownValue.toLowerCase()) > -1
    );
  }

  /*Checks to see if s0 is contains to s1*/
  function containsString(s0, s1) {
    return s0.toLowerCase().indexOf(s1.toLowerCase()) > -1;
  }

  /*Uses containsString to check to see if the two strings are equal*/
  function compareString(s0, s1) {
    return containsString(s0, s1) && containsString(s1, s0);
  }
})();
