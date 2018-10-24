const gulp = require("gulp");
const merge2 = require("merge2");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const gzip = require("gulp-gzip");


const BUNDLES = require("./bundles");

const BUNDLE_OUTPUT_PATH = "dist";

const GZIP_ENABLED = false;

gulp.task("build", () => {
    let bundleNames = Object.keys(BUNDLES);

    let streams = bundleNames.map(bundleName => {
        let stream =
            gulp.src(BUNDLES[bundleName])
                .pipe(concat(`${bundleName}.js`))
                .pipe(gulp.dest(BUNDLE_OUTPUT_PATH))
                .pipe(rename(`${bundleName}.min.js`))
                .pipe(uglify())
                .pipe(gulp.dest(BUNDLE_OUTPUT_PATH));

        if (!GZIP_ENABLED) return stream;

        return stream
            .pipe(rename(`${bundleName}.gz.js`))
            .pipe(gzip({
                append: false,
                gzipOptions: { level: 9 }
            }))
            .pipe(gulp.dest(BUNDLE_OUTPUT_PATH));
    });

    return merge2(streams)
});
