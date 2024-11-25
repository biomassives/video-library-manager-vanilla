import re

def update_html(html_content):
    """
    Updates the HTML to ensure window.videoData is available before filterAndSortVideos is called.
    """
    
    # Find the script tag where the DOMContentLoaded event listener is attached
    pattern = r"<script>[\s\S]*?document\.addEventListener\('DOMContentLoaded', \(\) => {[\s\S]*?}\);[\s\S]*?</script>"
    match = re.search(pattern, html_content)

    if match:
        script_content = match.group(0)

        # Find the call to filterAndSortVideos() within the DOMContentLoaded listener
        pattern_filter = r"filterAndSortVideos\(\);"
        match_filter = re.search(pattern_filter, script_content)

        if match_filter:
            # Wrap the call to filterAndSortVideos() in a setTimeout to ensure window.videoData is defined
            script_content = script_content.replace(
                match_filter.group(0),
                "setTimeout(filterAndSortVideos, 0);"
            )

            # Replace the original script tag with the modified one
            html_content = html_content.replace(match.group(0), script_content)

    return html_content

if __name__ == "__main__":
    with open("updated_html_file.html", "r") as f:  # Replace 'your_html_file.html'
        html_content = f.read()

    updated_html = update_html(html_content)

    with open("updated_html_file2.html", "w") as f:  # Replace 'updated_html_file.html'
        f.write(updated_html)
