# Hosting, costs and reuse

**The agent handles deployment. You do not write code, run server commands or set up cloud services.** You decide the event, audience, budget and how long the activity should stay available. You may need to log in, grant access or approve a concrete cost.

For online participation, the delivered activity needs a link people can open from outside the presenter's computer. A preview that only runs on your own computer is a test step, not the delivery. You do not need an account with a big cloud provider: the agent should choose the simplest hosting that supports the agreed activity.

## Choose hosting to fit the interaction

| Option | Suitable when | What the agent must check |
|---|---|---|
| Static hosting | People explore an independent visual, case or activity that runs in their own browser. | External access, mobile behaviour and whether progress needs saving. Static files alone do not collect shared live responses. |
| Managed app hosting | The activity needs shared responses or saved state, and a service can run it. | Supported runtime, storage, access, session lifetime, idle behaviour, usage limits and cost. |
| A small cloud server | The app needs its own server process or a compatible setup is already available. | Current price, allowance, capacity, HTTPS, backups and resource cleanup. |
| A temporary preview link | A short trial needs external feedback before final hosting is chosen. | Expiry, access and dependence on the presenter's computer. Do not treat it as a reliable event deployment without checking those limits. |

Some agents include managed app building and hosting; [tools and models](../skills/interactive-classroom-presentation/references/tools-and-models.md) lists examples. Many other services fit too. The agent checks the person's actual access and the chosen provider's current terms; it should not assume every free plan supports live sessions.

Before handover, the agent verifies the public HTTPS address from outside the local preview, the intended participant access and, for shared activities, consistent state across separate clients. Test joining without the presenter's login. Participants should not need the presenter's AI subscription. Try the actual phones and network before the event.

The agent provides the link, access instructions, operating guide, costs and availability period. If it cannot deploy with its current tools, it explains the missing access and guides the user to a capable setup. It does not hand deployment commands to the person as unfinished work.

## The Singularity example's server option

The sections below record one setup for the included Node/SQLite app: a dedicated Linux VM with HTTPS on Google Cloud. It is an example, not a recommendation of that provider. This example has no runtime AI API cost. Other activities may need a different setup; their capacity must be checked independently.

## A micro instance and the free allowance

Google Cloud's ongoing free allowance currently includes eligible **non-preemptible e2-micro** time in `us-west1`, `us-central1` or `us-east1`, with up to **30 GB-month of standard persistent disk** and a limited outbound traffic allowance. The compute allowance is shared across eligible instances; a second VM is not automatically another free VM. A trial credit is a separate offer. Verify your account and current terms before provisioning. [Google Cloud Free Tier](https://docs.cloud.google.com/free/docs/free-cloud-features)

A publicly reachable VM can still incur networking charges. External IPv4 has separate pricing; at a listed rate of **US$0.005/hour**, 720 billed hours would be **US$3.60**, before other charges and tax. An unused reserved address may have a different rate. [Google Cloud IP address pricing](https://cloud.google.com/vpc/network-pricing#ipaddress)

Ask the agent to produce a short table for **your** planned setup:

| Item | The agent should establish |
|---|---|
| Coding agent | Whether existing access supports files, execution and testing; then any plan or usage cost and whether extra usage is enabled. [Tools, models and costs](../skills/interactive-classroom-presentation/references/tools-and-models.md) |
| VM | Region, type, standard versus Spot, hours, and whether your free allowance is still available. |
| Disk | Size and disk type; a faster default disk may fall outside the relevant allowance. |
| Internet access | Address, outbound traffic, and any other network charges. |
| Domain and HTTPS | A domain you own or another usable hostname; certificate setup and any domain fee. |
| Backups | Location, storage cost, retention, and how to restore. |
| End date | Expected event cost, monthly cost if forgotten, and a shutdown reminder. |

Create a billing alert. An alert is a warning, not a hard spending cap. Do not create a load balancer, managed database or extra VM unless there is a concrete need and you have approved the cost.

## What the Singularity server cost

The original deployment used a standard e2-micro in Iowa, a 10 GB standard persistent disk and one public IPv4 address. The configuration was recorded before the server was removed. At the published USD list rates, the estimate is:

| Resource | 24-hour equivalent | 730-hour month |
|---|---:|---:|
| e2-micro at $0.008376428/hour | $0.2010 | $6.1148 |
| Public IPv4 at $0.005/hour | $0.1200 | $3.6500 |
| 10 GB standard disk at $0.04/GB-month | $0.0132 | $0.4000 |
| **Total, rounded** | **$0.33** | **$10.16** |

This is an estimate, not a retrieved invoice. It excludes tax, outbound traffic, optional services, the coding-agent subscription and any free allowance or credit. The daily disk figure prorates a 730-hour month. Other currencies use the provider's applicable prices. [Compute pricing](https://cloud.google.com/products/compute/pricing/general-purpose), [disk pricing](https://cloud.google.com/compute/disks-image-pricing), [IPv4 pricing](https://cloud.google.com/vpc/network-pricing#ipaddress)

Major cloud providers may offer introductory credits. For example, eligible Google Cloud newcomers currently receive **US$300 valid for 90 days**. Covered usage can be paid from that credit, leaving **US$0 payable for this hosting** while sufficient valid credit remains. This does not pay for an unrelated coding-agent subscription. Check eligibility, exclusions and expiry rather than assuming every account has credit. [Google Cloud trial terms](https://docs.cloud.google.com/free/docs/free-cloud-features)

## Deploying the included example

If this VM setup is chosen, use a dedicated VM for the activity. The provided [bootstrap script](../deploy/bootstrap-vm.sh) targets a fresh x86-64 Debian/Ubuntu system, installs Node 24 and Caddy, and serves the app behind HTTPS. It refuses to overwrite an existing installation. It does not create cloud resources, DNS or firewall rules. The following steps are for the agent, not the presenter.

The agent should:

1. Identify the exact cloud project and new VM, with your approved estimate. Do not reuse or modify unrelated services.
2. Configure a hostname pointing to that VM, allow HTTP/HTTPS, and restrict administrative access. Keep app port 8787 internal.
3. Clone your reviewed repository onto the VM. Run `sudo bash deploy/bootstrap-vm.sh YOUR_HOSTNAME` from its folder. Replace `YOUR_HOSTNAME` with the actual DNS name; do not paste an example domain unchanged.
4. Verify HTTPS, the health endpoint, one complete game, private speaker access and the public QR from mobile data.
5. Give you the working address, controls, exact resource names, expected cost, backup procedure and shutdown date. Do not claim success merely because a command exited successfully.

The application uses a private local SQLite database. Never put its data directory or live access links in GitHub. [Security limits](../SECURITY.md)

## Save to your GitHub account

GitHub, or another code host, can keep the code, presentation, notes and instructions so your agent can restore or change the activity later. Ask it to create your own repository, commit the reviewed project, and verify it can be cloned. A private repository is a sensible default for unpublished teaching material.

Public repositories need a separate check for permission to share content, personal details, secrets, exported links and real student responses. Git history matters too: deleting a secret from the latest file does not remove it from earlier commits.

**GitHub is not a backup of live participant responses.** Have the agent save those separately if needed. For this example's VM, the agent runs `sudo bash deploy/backup-vm.sh` to create a private archive under `/var/backups/singularity`, downloads it to a private location and verifies it before removing the server. Managed services may use a different export or backup method. [Example restore instructions](../deploy/README.md)

## Switch to another presentation

The agent can reuse compatible hosting for a different activity, one at a time. A new presentation does not automatically need a new server. It should save the old project to GitHub, privately back up required session data, prepare and test the new version locally, then deploy it with a clean database or a compatible migration. Check the hosting service's limits before switching.

Replacing the title or `deck.json` alone is not enough: this example's graphics, rounds and speaker mappings also live in code. Have the agent check them together. Keep a rollback version and verify the new QR, speaker notes and results before inviting the class. Do not switch software during an active session.

After restarting a stopped VM, the public address may have changed. The agent should recheck DNS, HTTPS and the join code. [Google Cloud stop/start behaviour](https://docs.cloud.google.com/compute/docs/instances/stop-start-instance)

## After the presentation

Set a calendar reminder when you schedule the event: **save the project, verify the backup, then stop hosting**. Ask the agent to offer a reminder or shutdown schedule only when the date is known and you have approved it; do not silently shut down a future session.

Closing the browser does not stop hosting. For managed services, have the agent check how to unpublish, stop or remove the activity and any billable storage. For a VM, stopping it stops compute charges, but retained disks, snapshots and reserved addresses may still be billed. If you no longer need the installation, ask the agent to identify and remove only its resources after checking the backup. [Google Cloud stop/start billing notes](https://docs.cloud.google.com/compute/docs/instances/stop-start-instance)

For your next class, give the agent your GitHub repository and this guide. It can restore the activity to suitable hosting or develop a different one with you. Have it check access and explain the current cost again before proceeding.
