module.exports = {
    server: {
        command: "cirro launch ../test-data/pbmc3k_no_raw.h5ad --no-open --host localhost",
        port: 5000,
        launchTimeout: 10000
    }
}