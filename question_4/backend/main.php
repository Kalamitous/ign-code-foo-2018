<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    
    // connect to MySQL
    $conn = new mysqli($servername, $username, $password);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error . "<br><br>");
    }
    echo "Connected successfully<br><br>";

    // create database
    $sql = "CREATE DATABASE IGNContent";
    if ($conn->query($sql) === TRUE) {
        echo "'IGNContent' database created successfully<br>";
    } else {
        echo "Error creating 'IGNContent' database: " . $conn->error . "<br>";
    }

    // select database
    mysqli_select_db($conn, "IGNContent");

    // create tables
    $sql = "CREATE TABLE Items (
        ID int AUTO_INCREMENT,
        GUID char(24),
        Category VARCHAR(255),
        Title VARCHAR(255),
        Description VARCHAR(255),
        pubDate DATETIME,
        Slug VARCHAR(255),
        State VARCHAR(255),
        Thumbnail VARCHAR(255),
        PRIMARY KEY (ID),
        UNIQUE (GUID),
        INDEX (pubDate)
    )";
    if ($conn->query($sql) === TRUE) {
        echo "'Items' table created successfully<br>";
    } else {
        echo "Error creating 'Items' table: " . $conn->error . "<br>";
    }

    $sql = "CREATE TABLE ItemNetworks (
        ID int,
        Network VARCHAR(255),
        FOREIGN KEY (ID) REFERENCES Items(ID),
        INDEX (ID)
    )";
    if ($conn->query($sql) === TRUE) {
        echo "'ItemNetworks' table created successfully<br>";
    } else {
        echo "Error creating 'ItemNetworks' table: " . $conn->error . "<br>";
    }

    $sql = "CREATE TABLE ItemTags (
        ID int,
        Tag VARCHAR(255),
        FOREIGN KEY (ID) REFERENCES Items(ID),
        INDEX (ID),
        INDEX (Tag)
    )";
    if ($conn->query($sql) === TRUE) {
        echo "'ItemTags' table created successfully<br><br>";
    } else {
        echo "Error creating 'ItemTags' table: " . $conn->error . "<br><br>";
    }

    // track records created
    $itemCount = 0;
    $networkCount = 0;
    $tagCount = 0;

    // loop through every page of RSS feed
    for ($page = 1; $page <= 20; $page++) {
        $fail = FALSE;
        $url = "https://ign-apis.herokuapp.com/content/feed.rss?page=" . $page;
        $xml = simplexml_load_file($url);
        if ($xml === FALSE) {
            echo "Error loading XML for page " . $page . "<br>";
        } else {
            echo "XML for page " . $page . " loaded successfully<br>";
        }
        
        // loop through each content item of page
        foreach ($xml->channel->item as $item) {
            $ign = $item->children('http://www.ign.com');
            $date = date('Y-m-d H:i:s', strtotime($item->pubDate));
            $thumbnail = $ign->thumbnail->attributes()['link'];
            $thumbnail = str_replace("https://", "", $thumbnail);
            $thumbnail = str_replace("_compact.png", "", $thumbnail);

            // create new record in 'Items'
            $sql = sprintf("INSERT INTO Items (GUID, Category, Title, Description, pubDate, Slug, State, Thumbnail)
            VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')",
            $conn->escape_string($item->guid),
            $conn->escape_string($item->category),
            $conn->escape_string($item->title),
            $conn->escape_string($item->description),
            $conn->escape_string($date),
            $conn->escape_string($ign->slug),
            $conn->escape_string($ign->state),
            $conn->escape_string($thumbnail));
            if ($conn->query($sql) === TRUE) {
                $itemCount++;

                // create new record in 'ItemNetworks'
                if (strpos($ign->networks, ",") === FALSE) {
                    if (empty($ign->networks) === FALSE) {
                        $sql = sprintf("INSERT INTO ItemNetworks (ID, Network)
                        VALUES (LAST_INSERT_ID(), '%s')",
                        $conn->escape_string($ign->networks));
                        if ($conn->query($sql) === TRUE) {
                            $networkCount++;
                        }
                    }
                } else {
                    $networks = explode(",", $ign->networks);

                    foreach ($networks as $network) {
                        if (empty($network) === FALSE) {
                            $sql = sprintf("INSERT INTO ItemNetworks (ID, Network)
                            VALUES (LAST_INSERT_ID(), '%s')",
                            $conn->escape_string($network));
                            if ($conn->query($sql) === TRUE) {
                                $networkCount++;
                            }
                        }
                    }
                }

                // create new record in 'ItemTags'
                if (strpos($ign->tags, ",") === FALSE) {
                    if (empty($ign->tags) === FALSE) {
                        $sql = sprintf("INSERT INTO ItemTags (ID, Tag)
                        VALUES (LAST_INSERT_ID(), '%s')",
                        $conn->escape_string($ign->tags));
                        if ($conn->query($sql) === TRUE) {
                            $tagCount++;
                        }
                    }
                } else {
                    $tags = explode(",", $ign->tags);
                    
                    foreach ($tags as $tag) {
                        if (empty($tag) === FALSE) {
                            $sql = sprintf("INSERT INTO ItemTags (ID, Tag)
                            VALUES (LAST_INSERT_ID(), '%s')",
                            $conn->escape_string($tag));
                            if ($conn->query($sql) === TRUE) {
                                $tagCount++;
                            }
                        }
                    }
                }
            } else {
                // reached item that is already in database so update is complete
                $fail = TRUE;

                break;
            }
        }

        if ($fail === TRUE || $page == 20) {
            // output results if reached item that is already in database or end of RSS feed
            echo "<br>Created " . $itemCount . " new records in 'Items'<br>";
            echo "Created " . $networkCount . " new records in 'ItemNetworks'<br>";
            echo "Created " . $tagCount . " new records in 'ItemTags'<br>";

            break;
        }
    }
?>
