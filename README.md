<h1>IMS - Meatball Solution</h1>
<dl>
  <h3>
    <dt>Mission Statement</dt>
  </h3>
  <h4>
    <dd>
      Enable users to rapidy update and visualize a field status to affect
      decision making within an organization.
    </dd>
  </h4>
</dl>
<dl>
  <h3>
    <dt>Execution</dt>
  </h3>
  <h4>
    <dd>
      The IMS - Meatball solution deploys through the site collection's master
      page. Thus all pages natively run the solution.
    </dd>
    <dd>
      The runtime enviornment requires jQuery, specifically Ajax, to function.
      Most DoD SharePoint environments load jQuery to support other solutions.
      Please edit the master page to confirm its reference.
    </dd>
  </h4>
  <h3>
    <dt>Features</dt>
  </h3>
  <h4>
    <dd>
      <ul>
        <li>
          <img src="./dist/media/basic.png" />
          <br />
          All select list values, by default, will be replaced with circles of
          different colors.
        </li>
        <li>
          <img src="./dist/media/basic popover.png" />
          <br />
          A popover appears when you mouse over the circle.
        </li>
        <li>
          <img src="./dist/media/basic popover explained.png" />
          <br />
          The popover displays the column and row name, all available choices
          for the cell, the currently selected value, the last history change
          made, and a show more button. Clicking on any choice will update the
          list and page in real time.
        </li>
        <li>
          <img src="./dist/media/history.png" />
          <br />
          Clicking on show more, will open a history panel.
        </li>
        <li>
          <img src="./dist/media/history explained.png" />
          <br />
          It displays all historical changes, and comments made for that
          particular cell. An input area at the bottom of the history panel
          allows for custom comments to be made.
        </li>
      </ul>
    </dd>
  </h4>
  <h3>
    <dt>Customizations</dt>
  </h3>
  <dd>
    <ul>
      <li>
        <h4>Defaults</h4>
        <h5>
          The script will replace text in any select list with a circle of a
          known color. <br />
          If the text isn't a default value, then a circle of the background
          color will appear. <br />
          The default values are:
          <table>
            <tr>
              <td>
                Text
              </td>
              <td>
                Color
              </td>
            </tr>
            <tr>
              <td>Up</td>
              <td>Green</td>
            </tr>            
            <tr>
              <td>Down</td>
              <td>Red</td>
            </tr>            
            <tr>
              <td>Degraded</td>
              <td>Yellow</td>
            </tr>            
            <tr>
              <td>NA</td>
              <td>Inherit</td>
            </tr>            
            <tr>
              <td>100-90</td>
              <td>Green</td>
            </tr>            
            <tr>
              <td>89-79</td>
              <td>Yellow</td>
            </tr>            
            <tr>
              <td>79-10</td>
              <td>Red</td>
            </tr>            
            <tr>
              <td><79 </td>
              <td>Red</td>
            </tr>
            <tr>
              <td><10 </td>
              <td>Blue</td>
            </tr>
          </table>
        </h5>
      </li>
      <li>
        <h4>
          Example image
        </h4>
        <img src="./dist/media/customization.png" />
      </li>
      <li>
        <h4>Colors and Values</h4>
        <h5>
          To add custom values:
          <ol>
            <li>
              Add a script editor to the page, or use one on the page.
            </li>
            <li>
              Write the following inside the script editor:
              <br />
              <pre>
                <code>
                  <script>
                      var meatball_override = [
                        { value: "", color: "" },
                        { value: "", color: "" },
                      ];
                  </script>
                </code>
              </pre>
            </li>
            <li>
              The values must line up with the custom values. The colors can be
              words or # code.
              <a href="http://colorcode.is/">Color Code</a> can be helpful here.
            </li>
            <li>
              Example:<br />
              <pre>
              <code>
              <script>
                var meatball_override = [
                  { value: "Hi", color: "orange" },
                  { value: "Editor", color: "brown" },
                  { value: "You", color: "black" },
                  { value: "Got", color: "gray" },
                  { value: "This", color: "#ee00ee" },
                ];
              </script>
              </code>
              </pre>
            </li>
          </ol>
        </h5>
      </li>
      <li>
        <h4>Ignore Columns</h4>
        <h5>
          To set columns to be ignored:
          <ol>
            <li>
              Add a script editor to the page or use one on the page.
            </li>
            <li>
              Write the following into the script editor
              <pre>
              <code>
              <script>
                var meatball_ignore = [];
              </script>
              </code>
              </pre>
            </li>
            <li>
              Inside of the array, add in the name of the column to be ignored.
            </li>
            <li>
              Example:
              <br />
              Column name: "Test Column"
              <br />
              <pre>
              <code>
              <script>
                var meatball_ignore = ["Test Column"];
              </script>
              </code>
              </pre>
            </li>
          </ol>
        </h5>
      </li>
      <li>
        <h4>Text Columns</h4>
        <h5>
          To set columns to display text instead of a meatball:
          <ol>
            <li>
              Add a script editor to the page or use one on the page.
            </li>
            <li>
              Write the following into the script editor
              <pre>
              <code>
              <script>
                var meatball_text = [];
              </script>
              </code>
              </pre>
            </li>
            <li>
              Inside of the array, add in the name of the column to be ignored.
            </li>
            <li>
              Example:
              <br />
              Column name: "Test Column"
              <pre>
              <code>
              <script>
                var meatball_text = ["Test Column"];
              </script>
              </code>
              </pre>
            </li>
          </ol>
        </h5>
      </li>
      <li>
        <h4>Disable Script</h4>
        <h5>
          To disable the script from running:
          <ol>
            <li>
              Add a script editor to the page or use one on the page.
            </li>
            <li>
              Write the following into the script editor
              <pre>
              <code>
              <script>
                var ims_meatball_hide = true;
              </script>
              </code>
              </pre>
            </li>
          </ol>
        </h5>
      </li>
    </ul>
  </dd>
  <h4><dt>Debugging</dt></4>
  <h5>
    <dd>
      The following should help fix most issues with the script.
      <ol>
        <li>
          Check the page's lists.
        </li>
        <li>
          Check the column names, including the hidden ones.
        </li>
        <li>
          Verify column names haven't been changed.
        </li>
        <li>
          Verify the values in each select column and ensure they match with
          defaults or overrides.
        </li>
        <li>
          Verify the overrides are created correctly.
        </li>
      </ol>
    </dd>
    <dd>
      If error persists, then contact the developers.
      <ol>
        <li>
          Add a script editor to the page or use one on the page.
        </li>
        <li>
          Write the following into the script editor
          <pre>
          <code>
          <script>
            var meatball_debug = true;
          </script>
          </code>
          </pre>
          Now, any error will appear on a notification design to remain on the
          page no matter what.
        </li>
        <li>
          To turn off debug mode, either delete { var meatball_debug = true; }
          or change it to { var meatball_debug = false }
        </li>
      </ol>
    </dd>
  </h5>
</dl>
