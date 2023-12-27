from setuptools import setup

setup(
    name='chase-car-dashboard-backend',
    version='5.0.0',
    packages=['core', 'framework', 'components'],
    url='badgersolarracing.org',
    license='',
    author='Badger Solar Racing Software Team',
    author_email='',
    description='',
    install_requires=['uvicorn','fastapi','redis', 'numpy', 'XlsxWriter', 'pandas', 'aiohttp']
)
