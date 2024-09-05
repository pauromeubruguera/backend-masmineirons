module.exports = {
    'strapi-neon-tech-db-branches': {
        enabled: true,
        config: {
            neonApiKey: "l476j8yu0ytypg5g9lc885dk9qfwhqtx313wf2n7dwvd6toqngej1tc1prg4kmxv", // get it from here: https://console.neon.tech/app/settings/api-keys
            neonProjectName: "masmineirons", // the neon project under wich your DB runs
            neonRole: "masmineironsdb_owner", // create it manually under roles for your project first
            gitBranch: "main", // branch can be pinned via this config option. Will not use branch from git then. Usefull for preview/production deployment
        },
    },
};