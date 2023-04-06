var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/bejewelled/bejewelled.github.io.git', // Update to point to your repository  
        user: {
            name: 'bejewelled', // update to use your name
            email: 'jtg7sz@virginia.edu' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)