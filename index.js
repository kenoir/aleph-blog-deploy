var request = require('request');
var fs = require('fs');
var unzipToS3 = require('unzip-to-s3');

console.log('Loading function');

exports.handler = function(event, context) {
    // Create the S3 client
    var bucketUpload = unzipToS3.createClient({
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      token: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: 'aleph-blog' 
    });

    var localFile = '/tmp/deploy.tar.gz';
    var releaseUrl = 'https://github.com/kenoir/aleph-blog/archive/' + event.release.tag_name + '.tar.gz';
    var writeStream = fs.createWriteStream(localFile);

    console.log("Downloading release from: " + releaseUrl);

    request.get(releaseUrl).on('response', function (response) {
	console.log(githubUsername, githubToken);
        if (response.statusCode == 200) {
            writeStream.pipe(res);
            writeStream.on('end', function() {
		console.log("Download complete.");
                var zipStream = fs.createReadStream(writeStream);
		bucketUpload(zipStream).on('end', function() {
                    context.succeed();
                }).on('error', function(err) { context.fail(err) });
            }).on('error', function(err) { context.fail(err) });
        } else {
            context.fail("Failed with status: " + response.statusCode);
        }
    }).on('error', function(err) { context.fail(err) });
};
