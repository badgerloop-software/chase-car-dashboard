from setuptools import setup

setup(
    name='chase-car-dashboard-backend',
    version='5.0.0',
    packages=['core', 'framework', 'components'],
    url='badgerloop.org',
    license='',
    author='badgerloop',
    author_email='',
    description='',
    install_requires=['uvicorn','fastapi','redis', 'numpy', 'XlsxWriter']
)
