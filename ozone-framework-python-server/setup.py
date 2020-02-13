import os
from setuptools import setup, find_packages, Command


class CleanCommand(Command):
    """Custom clean command to tidy up the project root."""
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        os.system('rm -vrf ./build ./dist ./*.pyc ./*.tgz ./*.egg-info')


setup(
    name='OZONE',
    version='v8.0.0.1-RC1',
    description="OZONE Framework",
    # TODO: eventually use find_packages() from setuptools, when the project is organized with a better structure.
    packages=[
        'config',
        'config.settings',
        'config.owf_mixins',
        'config.owf_permissions',
        'config.helpers',
        'config.owf_utils',
        'config.owf_utils.transformer',
        'config.owf_utils.transformer.django',
        'config.ssl_auth',

        'migration_owf',
        'migration_owf.transformers',
        'migration_owf.migration_result',
        'migration_owf.migration_result.mapping',
        'migration_owf.post_export',
        'migration_tool',
        'migration_tool.adapters',

        'appconf',
        'appconf.migrations',
        'dashboards',
        'dashboards.migrations',
        'domain_mappings',
        'domain_mappings.migrations',
        'intents',
        'intents.migrations',
        'legacy',
        'metrics',
        'owf_groups',
        'owf_groups.migrations',
        'people',
        'people.administration',
        'people.migrations',
        'preferences',
        'preferences.administration',
        'preferences.migrations',
        'roles',
        'roles.migrations',
        'stacks',
        'stacks.migrations',
        'widgets',
        'widgets.migrations',
    ],
    include_package_data=True,

    zip_safe=False,
    # python_requires='3.7.4',
    # test_suite=,
    # tests_require=,
    # install_requires=['docutils>=0.3'],
    # extras_require=[],
    # classifiers=[
    #     'License :: OSI Approved :: Python Software Foundation License'
    # ],
    cmdclass={
        'clean': CleanCommand,
    },
)
