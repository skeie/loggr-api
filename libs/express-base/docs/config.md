# Configuration

There are four groups of configuration types where all of them should expose values to the application via environment variables.

1. Secret values, such as database passwords and API keys. These values should be exposed using [FiaaS secrets](https://confluence.schibsted.io/pages/viewpage.action?pageId=22644830).
2. IP addresses / hostnames subject to change based on the environment where the application runs. These values should be exposed by [FIaaS via service discovery](https://confluence.schibsted.io/display/FI/Fiaas+Service+Discovery).
3. Other values subject to change based on the environment where the application runs. E.g. if you want `sendMailIfSomethingBadHappens` to be toggled off for environments other than production.
4. Values you believe not suitable for the three groups above, but still want to extract out from the code (e.g. to more easily share them between modules).

[config-loader](https://github.schibsted.io/finn/config-loader) should be used to manage the configuration and will assist by requiring values, setting defaults and enforcing types.

Please note that values from groups 1) and 2) should *not* be included in the application's repository.
