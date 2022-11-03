import _orderBy from "lodash/orderBy";
import styles from "./ProjectsPage.module.scss";
import Icon from "../../../components/Icon";
import AddProjectButton from "./AddProjectButton";
import cx from "classnames";
import ProjectCard from "./ProjectCard";
import PageBody from "../../../components/PageBody";
import {ProjectsHeader} from "./ProjectsHeader";

class Projects_Page extends React.Component {

    componentDidMount() {
        const { projects } = this.props;

        if (!projects) {
            this.props.viewProjectsPage();
        }
    }

    sortProjects(projects) {
        return _orderBy(projects, [this.state.orderBy], this.state.sortOrder);
    }

    canCreateProject = () => {
        const { user, projects } = this.props;

        return !(user.max_projects && projects.length >= user.max_projects);
    };

    renderNoProjects() {
        let message = 'No Projects Here!';

        return (
            <div>
                <div className={styles.noProjectWrapper}>
                    <h1>
                        <Icon name="exclamation-triangle" />
                    </h1>
                    <h2>{message}</h2>
                    <AddProjectButton />
                </div>
            </div>
        );
    }

    renderProjects(sortedProjects) {
        return sortedProjects.map(project => {
            return (
                <article className={cx('cards_card', styles.projectCard)}>
                    <ProjectCard
                        project={project}
                        key={project.id}
                    />
                </article>
            );
        });
    }

    renderNoSearchResult() {
        return (
            <div className={styles.noProjectWrapperSearch}>
                <h1>
                    <Icon name="exclamation-triangle" />
                </h1>
                <h2>No projects found!</h2>
            </div>
        );
    }

    closeNewUserWelcome = () => {
        this.setState({ showNewUserWelcome: false });
    };





    handleSearch = ({ filteredData, filtering }) => {
        this.setState({ searchedProjects: filteredData, searching: filtering });
    };



    filterOptions = [
        {
            label: 'Order By Favourites',
            value: 'is_favourite',
            clearableValue: false
        },
        {
            label: 'Order By Name',
            value: 'title',
            clearableValue: false
        },
        {
            label: 'Order By Created Date',
            value: 'created_at',
            clearableValue: false
        },
        // TODO
        // {
        //   label: 'Show Favourites First',
        //   value: 'title',
        //   clearableValue: false
        // },
        // {
        //   label: 'Order By Views',
        //   value: 'title',
        //   clearableValue: false
        // },
    ];

    /* any projects that fullfil internal conditions
    will get returned. use any other filters like the "favourites only" one here for performance and
    to avoid running a seperate filter down the line more than once  */
    customFilter = projects => {
        const { folderId } = this.props;
        const { favouritesOnly } = this.state;
        return projects.filter(project => {
            let passesGroupFilter;
            const projectGroupID = project.project_group_id;

            if (folderId) {
                passesGroupFilter = projectGroupID == folderId;
            } else {
                passesGroupFilter = !projectGroupID ;
            }

            const passesFavouritesFilter = favouritesOnly ? project.is_favourite : true;

            return passesGroupFilter && passesFavouritesFilter;
        });
    };


    render() {
        let {
            projects,
            updatePageLoadingState,
            user: { parent_user_id }
        } = this.props;
        const { searching, searchedProjects } = this.state;
        const isSubUser = !!parent_user_id;

        if (!projects) {
            return null;
        }

        //     Add a little delay here makes the UI nicer and the loade
        setTimeout(() => {
            updatePageLoadingState(false);
        }, 2000);

        // use projects that pass the search filter first
        projects = searchedProjects.length ? searchedProjects : projects;
        // then apply any other ones like folder or favorites-only etc ...
        /**
         * If user is subuser, no need to filter by folder/favourites etc.
         */
        if (!isSubUser) {
            projects = this.customFilter(projects);
        }

        const sortedProjects = this.sortProjects(projects);

        const noProjects = projects.length === 0 && parent_user_id === 0 && !searching;
        const noSearchResults = searching && !searchedProjects.length;

        return (
            <PageBody customHeader={<ProjectsHeaderComponent meta={this.headerLeftSection} {...this.props} />}>
                <section className={styles.wrapper}>
                    {noProjects ? (
                        this.renderNoProjects()
                    ) : (
                        <div className={cx('cards_grid')}>
                            {noSearchResults ? this.renderNoSearchResult() : this.renderProjects(sortedProjects)}
                        </div>
                    )}

                </section>
            </PageBody>
        );
    }
}