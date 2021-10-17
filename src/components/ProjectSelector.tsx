import { useEffect, useState } from "react";
import { fetchWorkspaces } from "lib/api";
import { Subject, Workspace } from "types";
import { Link, useParams } from "react-router-dom";
import { genPath } from "lib/atoms";
import Slugs from "lib/slugs";

interface ProjectSelectorProps {
    organizationId: string;
    onProjectChange: (newProject: string) => void;
}

function ProjectSelector({ organizationId, onProjectChange }: ProjectSelectorProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const slugs = useParams<Slugs>();

    useEffect(() => {
        if (!organizationId) {
            return;
        }

        setSubjects([]);

        const apiHelper = async () => {
            try {
                const result = await fetchWorkspaces();
                result.forEach((workspace: Workspace) => {
                    if (workspace.owner.id === organizationId) {
                        setSubjects(workspace.subjects);
                    }
                });
            } catch {
                setSubjects([]);
            }
        };

        apiHelper();
    }, [organizationId]);

    if (subjects.length === 0) {
        return (
            <div id="ProjectSelector">
                <p className="font-bold">No subjects</p>
            </div>
        );
    }

    return (
        <div id="ProjectSelector">
            <p className="text-xl">Subjects</p>

            {subjects.map((subject) => (
                <span key={subject.id}>
                    <p className="text-lg underline">{subject.name}</p>
                    <ul className="list-disc list-inside">
                        {subject.projects.sort((a, b) => {
                            return a.name.localeCompare(b.name)
                        }).map(project => (
                            <li key={project.id}>
                                <Link 
                                    to={genPath(slugs, { project: project.id })}
                                    replace={true}
                                >
                                    {project.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </span>
            ))}
        </div>
    );
}

export default ProjectSelector;
