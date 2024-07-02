// ==UserScript==
// @name         VirusTotal Query
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Query VirusTotal with IP/domain/URL/hash from a floating window
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'YOUR_VIRUSTOTAL_API_KEY'; // Replace with your VirusTotal API key

    // Add custom styles for the floating window
    GM_addStyle(`
        #vt-query-window {
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            padding: 20px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: none;
        }
        #vt-query-window input {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
        }
        #vt-query-window button {
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }
        #vt-query-window button:hover {
            background: #0056b3;
        }
        #vt-query-window .close-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
        }
    `);

    // Create the floating window
    const queryWindow = $(`
        <div id="vt-query-window">
            <span class="close-btn">X</span>
            <input type="text" id="vt-query-input" placeholder="Enter IP/domain/URL/hash">
            <button id="vt-query-btn">Query VirusTotal</button>
        </div>
    `);
    $('body').append(queryWindow);

    // Show the floating window when the hotkey is pressed
    $(document).on('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'V') {
            $('#vt-query-window').toggle();
        }
    });

    // Close the floating window
    $('#vt-query-window .close-btn').on('click', function() {
        $('#vt-query-window').hide();
    });

    // Query VirusTotal when the button is clicked
    $('#vt-query-btn').on('click', function() {
        const query = $('#vt-query-input').val();
        if (query) {
            queryVirusTotal(query);
        }
    });

    // Function to query VirusTotal
    function queryVirusTotal(query) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://www.virustotal.com/api/v3/search?query=${encodeURIComponent(query)}`,
            headers: {
                'x-apikey': API_KEY
            },
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                if (result.data && result.data.length > 0) {
                    const url = `https://www.virustotal.com/gui/search/${encodeURIComponent(query)}`;
                    window.open(url, '_blank');
                } else {
                    alert('No results found on VirusTotal.');
                }
            },
            onerror: function() {
                alert('Error querying VirusTotal.');
            }
        });
    }
})();