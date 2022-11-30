import PropTypes from 'prop-types';
import router from 'next/router';
import { AppShell, Container, Group, Navbar, Text, ActionIcon } from '@mantine/core';
import { IconFlag, IconFilter, IconApiApp, IconUsers } from '@tabler/icons';

import { PriceIcon } from 'public/icons';

import { Link } from 'components';

import { useGrowthFlags } from 'contexts/growth-flags-context';
import * as routes from 'routes';

import { LogoDarkImage } from 'public/images';
import Header from './Header';

import { useStyles } from './styles';

const ASIDE_WIDTH = 255;

const configurations = Object.values(routes.configuration);

const navbarTabs = [{
  label: routes.navbarTabs.FEATURE_FLAGS,
  path: routes.route.home,
  icon: <IconFlag />,
},
{
  label: routes.navbarTabs.ACTIVATION_PIPELINES,
  path: routes.route.emailSequences,
  icon: <IconFilter />,
},
{
  label: routes.navbarTabs.API_KEYS,
  path: routes.route.apiKey,
  icon: <IconApiApp />,
},
{
  label: routes.navbarTabs.TEAM_MEMBERS,
  path: routes.route.members,
  icon: <IconUsers />,
},
{
  label: routes.navbarTabs.PRICING,
  path: routes.route.subscriptionPlans,
  icon: <PriceIcon />,
},
];

const MainLayout = ({ children }) => {
  const growthflags = useGrowthFlags();
  const sideBarIsOn = !growthflags?.isOn('email-sequences');

  const { classes } = useStyles();

  const navbarTabsFiltered = navbarTabs.filter((tab) => !(tab.path === '/email-sequences' && !sideBarIsOn));
  return (
    <AppShell
      header={<Header />}
              // footer={<Footer />}
      navbar={(
        <Navbar
          p={0}
          style={{ height: '100vh', top: 0 }}
          hiddenBreakpoint="sm"
          width={{ sm: ASIDE_WIDTH, lg: ASIDE_WIDTH }}
          position={{ top: 0, left: 0 }}
        >
          <Group spacing={36} className={classes.logoGroup}>
            <Link type="router" href={routes.route.home} underline={false}>
              <LogoDarkImage />
            </Link>
          </Group>
          <Group
            pl={16}
            direction="column"
            position="left"
          >
            {navbarTabsFiltered.map((tab) => {
              const isTabActive = configurations.find(
                (item) => item.route === router.route && item.navbarTab === tab.label,
              );

              return (
                <Link
                  key={tab.label}
                  href={tab.path}
                  underline={false}
                  type="router"
                  style={{ width: '100%' }}
                >
                  <Group
                    direction="row"
                    className={[
                      classes.tabItem,
                      isTabActive && classes.activeTab,
                    ]}
                  >
                    <ActionIcon
                      radius="md"
                      variant="transparent"
                      size={40}
                      className={[
                        classes.tabIcon,
                        isTabActive && classes.activeIcon,
                      ]}
                    >
                      {tab.icon}
                    </ActionIcon>

                    <Text className={[
                      classes.label,
                      isTabActive && classes.activeLabel,
                    ]}
                    >
                      {tab.label}
                    </Text>
                  </Group>
                </Link>
              );
            })}
          </Group>
        </Navbar>
              )}
      fixed
      padding={0}
      styles={(theme) => ({
        root: {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: theme.white,
        },
      })}
    >
      <Container fluid size="xl" p={24}>
        {children}
      </Container>
    </AppShell>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
